/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 * Home: https://asitewithnoname.com/
 */
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { VFC, useContext, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import ProgressChart from '../../components/ProgressChart/ProgressChart';
import ProgressChartLoader from '../../components/ProgressChart/ProgressChartLoader';
import RankingPieChartLoader from '../../components/RankingPieChart/RankingPieChartLoader';
import SurvivorDashboardIcon from '../../components/SurvivorDashboardIcon/SurvivorDashboardIcon';
import { SeasonStatus, WeekStatus } from '../../generated/graphql';
import { useSurvivorDashboard } from '../../graphql/survivorDashboard';
import { useSurvivorView } from '../../graphql/survivorView';
import { TUser } from '../../models/User';
import { getEmptyArray } from '../../utils/arrays';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { BackgroundLoadingContext, WeekContext } from '../../utils/context';
import styles from '../../styles/survivor/view.module.scss';
import { WEEKS_IN_SEASON } from '../../utils/constants';
import { useSelectedWeek } from '../../graphql/sidebar';
import { logger } from '../../utils/logging';

type ViewSurvivorProps = {
	user: TUser;
};

const ViewSurvivor: VFC<ViewSurvivorProps> = ({ user }) => {
	const router = useRouter();
	const [selectedWeek] = useContext(WeekContext);
	const { data, error, isValidating } = useSurvivorView();
	const {
		data: dashboardData,
		error: dashboardError,
		isValidating: dashboardIsValidating,
	} = useSurvivorDashboard(selectedWeek);
	const {
		data: selectedWeekData,
		error: selectedWeekError,
		isValidating: selectedWeekIsValidating,
	} = useSelectedWeek(selectedWeek);
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) ||
				(!!dashboardData && dashboardIsValidating) ||
				(!!selectedWeekData && selectedWeekIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		data,
		isValidating,
		dashboardData,
		dashboardIsValidating,
		selectedWeekData,
		selectedWeekIsValidating,
	]);

	if (error) {
		logger.error({ text: 'Error when loading data for View Survivor', error });
	}

	if (dashboardError) {
		logger.error({
			text: 'Error when loading dashboard data for View Survivor',
			dashboardError,
		});
	}

	if (selectedWeekError) {
		logger.error({
			text: `Error when loading selected week ${selectedWeek}: `,
			selectedWeekError,
		});
	}

	if (dashboardData?.getSurvivorStatus === SeasonStatus.NotStarted) {
		router.replace('/');

		return <></>;
	}

	return (
		<Authenticated isRegistered>
			<CustomHead title="View Survivor Picks" />
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				<SkeletonTheme>
					<div className="row min-vh-100">
						<div
							className={clsx(
								'd-none',
								'd-md-inline-block',
								'col-4',
								'text-center',
								styles['logo-wrapper'],
							)}
						>
							{!dashboardData ? (
								<div className="mt-4">
									<RankingPieChartLoader />
								</div>
							) : (
								<SurvivorDashboardIcon
									isAlive={dashboardData.getMySurvivorDashboard?.isAliveOverall}
									isPlaying={user.hasSurvivor}
									lastPick={dashboardData.getMySurvivorDashboard?.lastPickTeam}
									pickForWeek={dashboardData.getMySurvivorPickForWeek?.team}
								/>
							)}
						</div>
						<div className="mt-4 d-block d-md-none">
							<Link href="/">
								<a>&laquo; Back to Dashboard</a>
							</Link>
						</div>
						<div
							className={clsx(
								'd-none',
								'd-md-inline-block',
								'col-8',
								styles['bar-wrapper'],
							)}
						>
							{!dashboardData ? (
								<>
									<ProgressChartLoader />
									<ProgressChartLoader />
								</>
							) : (
								<>
									<ProgressChart
										correct={dashboardData.survivorAliveForWeek}
										incorrect={dashboardData.survivorDeadForWeek}
										inProgress={dashboardData.survivorWaitingForWeek}
										isOver={selectedWeekData?.getWeek.weekStatus === WeekStatus.Complete}
										layoutId="survivorWeekStatus"
										max={dashboardData.getSurvivorWeekCount}
										type="Current Week Remaining"
									/>
									<ProgressChart
										correct={dashboardData.survivorAliveOverall}
										incorrect={dashboardData.survivorDeadOverall}
										isOver={dashboardData.getSurvivorStatus === SeasonStatus.Complete}
										layoutId="survivorOverallStatus"
										max={dashboardData.getSurvivorOverallCount}
										type="Overall Remaining"
									/>
								</>
							)}
						</div>
						<div
							className={clsx(
								'col-12',
								'mt-4',
								'table-responsive',
								'text-center',
								'p-0',
								styles['sticky-wrapper'],
							)}
						>
							<table className="table table-striped table-hover text-nowrap">
								<thead>
									<tr className={clsx('d-none', 'd-md-table-row', styles['nonsticky-row'])}>
										<th className="text-center" colSpan={99}>
											Week
										</th>
									</tr>
									<tr className={styles['sticky-row']}>
										<th scope="col">Player</th>
										{!data
											? getEmptyArray(WEEKS_IN_SEASON).map((_, i) => (
												<th key={`th-skeleton-${i}`} scope="col">
													<Skeleton width={25} />
												</th>
											))
											: getEmptyArray(data.getWeekInProgress ?? WEEKS_IN_SEASON).map(
												(_, i) => (
													<th key={`header-for-week-${i + 1}`} scope="col">
														<span className="d-none d-md-inline">{i + 1}</span>
														<span className="d-md-none">W{i + 1}</span>
													</th>
												),
											)}
									</tr>
								</thead>
								{!data ? (
									<tbody>
										{getEmptyArray(20).map((_, i) => (
											<tr key={`table-loader-${i}`}>
												<th
													className={clsx(styles['sticky-col'], styles['solid-bg'])}
													scope="row"
												>
													<Skeleton width={120} />
													<span className="d-none d-md-inline">
														<br />
														<Skeleton width={160} />
													</span>
												</th>
												{getEmptyArray(WEEKS_IN_SEASON).map((_, i) => (
													<td key={`td-skeleton-${i}`}>
														<Skeleton height={70} width={70} />
													</td>
												))}
											</tr>
										))}
									</tbody>
								) : (
									<tbody>
										{data.getSurvivorRankings.map(row => (
											<tr
												className={styles['pick-row']}
												key={`picks-for-user-${row.userID}`}
											>
												<th
													className={clsx(
														row.isAliveOverall ? 'bg-success' : 'bg-danger',
														styles['sticky-col'],
													)}
													scope="row"
												>
													{row.userName}
													<span className="d-none d-md-inline">
														<br />
														{row.teamName}
													</span>
												</th>
												{row.allPicks.map(pick => (
													<td
														className={clsx(
															pick.team === null
																? 'bg-danger'
																: pick.game.winnerTeam &&
																  pick.game.winnerTeam.teamID === pick.team.teamID
																	? 'bg-success'
																	: pick.game.winnerTeam &&
																	  pick.game.winnerTeam.teamID !== pick.team.teamID
																		? 'bg-danger'
																		: '',
														)}
														key={`pick-for-user-${row.userID}-week-${pick.survivorPickWeek}`}
													>
														{pick.team ? (
															<Image
																alt={`${pick.team.teamCity} ${pick.team.teamName}`}
																height={70}
																layout="fixed"
																src={`/NFLLogos/${pick.team.teamLogo}`}
																title={`${pick.team.teamCity} ${pick.team.teamName}`}
																width={70}
															/>
														) : (
															<h4 className="mb-0">
																No
																<br />
																Pick
															</h4>
														)}
													</td>
												))}
											</tr>
										))}
									</tbody>
								)}
							</table>
						</div>
					</div>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

ViewSurvivor.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isDoneRegistering = isDoneRegisteringSSR(session);

	if (!isDoneRegistering) {
		return IS_NOT_DONE_REGISTERING_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default ViewSurvivor;
