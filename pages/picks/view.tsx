/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@bduff9/pro-duotone-svg-icons/faAt';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { FC, useContext, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import { useViewMyPicks } from '../../graphql/picksView';
import { useWeeklyDashboard } from '../../graphql/weeklyDashboard';
import { TUser } from '../../models/User';
import { getEmptyArray } from '../../utils/arrays';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { BackgroundLoadingContext, WeekContext } from '../../utils/context';
import styles from '../../styles/picks/view.module.scss';
import { WeekStatus } from '../../generated/graphql';
import MyProgressChart from '../../components/MyProgressChart/MyProgressChart';
import { useSelectedWeek } from '../../graphql/sidebar';

type ViewPicksProps = {
	user: TUser;
};

const ViewPicks: FC<ViewPicksProps> = () => {
	const [selectedWeek] = useContext(WeekContext);
	const { data, error, isValidating } = useViewMyPicks(selectedWeek);
	const {
		data: myRankData,
		error: myRankError,
		isValidating: myRankIsValidating,
	} = useWeeklyDashboard(selectedWeek);
	const {
		data: selectedWeekData,
		error: selectedWeekError,
		isValidating: selectedWeekIsValidating,
	} = useSelectedWeek(selectedWeek);
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) ||
				(!!myRankData && myRankIsValidating) ||
				(!!selectedWeekData && selectedWeekIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		data,
		isValidating,
		myRankData,
		myRankIsValidating,
		selectedWeekData,
		selectedWeekIsValidating,
	]);

	if (error) {
		console.error(
			`Error when loading view my picks data for week ${selectedWeek}: `,
			error,
		);
	}

	if (myRankError) {
		console.error(
			`Error when loading my dashboard info for week ${selectedWeek}: `,
			myRankError,
		);
	}

	if (selectedWeekError) {
		console.error(`Error when loading selected week ${selectedWeek}: `, selectedWeekError);
	}

	return (
		<Authenticated isRegistered>
			<CustomHead title={`My week ${selectedWeek} picks`} />
			<div className="text-dark my-3 mx-2 min-vh-100 pb-4 col">
				<SkeletonTheme>
					<div className="row min-vh-100">
						{myRankData?.getMyWeeklyDashboard && (
							<>
								<div className="col-12 col-md-4 pb-3">
									<div className="content-bg rounded px-3 pt-2 h-100">
										<h5 className="text-center mb-0">Current Score</h5>
										<MyProgressChart
											correct={myRankData.getMyWeeklyDashboard.pointsEarned}
											correctLabel="Your Current Score"
											isOver={selectedWeekData?.getWeek.weekStatus === WeekStatus.Complete}
											max={myRankData.getMyWeeklyDashboard.pointsTotal}
											maxLabel="Max Score"
											possible={myRankData.getMyWeeklyDashboard.pointsPossible}
											possibleLabel="Your Max Possible Score"
										/>
									</div>
								</div>
								<div className="col-12 col-md-4 pb-3">
									<div className="content-bg rounded px-3 pt-2 h-100">
										<h5 className="text-center mb-0">Games Correct</h5>
										<MyProgressChart
											correct={myRankData.getMyWeeklyDashboard.gamesCorrect}
											correctLabel="Your Correct Games"
											isOver={selectedWeekData?.getWeek.weekStatus === WeekStatus.Complete}
											max={myRankData.getMyWeeklyDashboard.gamesTotal}
											maxLabel="Max Games"
											possible={myRankData.getMyWeeklyDashboard.gamesPossible}
											possibleLabel="Your Max Possible Games"
										/>
									</div>
								</div>
								<div className="col-6 col-md-2 pb-3">
									<div className="content-bg rounded text-center px-3 pt-2 h-100">
										<h5 className="px-2" style={{ height: '3rem' }}>
											My Tiebreaker
										</h5>
										<div className="h1">
											{!myRankData ? (
												<Skeleton />
											) : (
												myRankData.getMyWeeklyDashboard.tiebreakerScore
											)}
										</div>
									</div>
								</div>
								<div className="col-6 col-md-2 pb-3">
									<div className="content-bg rounded text-center px-3 pt-2 h-100">
										<h5 style={{ height: '3rem' }}>Final Game Total</h5>
										<div className="h1">
											{!myRankData ? (
												<Skeleton />
											) : (
												myRankData.getMyWeeklyDashboard.lastScore
											)}
										</div>
									</div>
								</div>
							</>
						)}
						<div className="col-12">
							<div className="content-bg rounded table-responsive">
								<table className="table table-hover align-middle">
									<thead>
										<tr>
											<th className="w-100" scope="col">
												Game
											</th>
											<th className="text-center" scope="col">
												Pick
											</th>
											<th className="text-center" scope="col">
												Points
											</th>
										</tr>
									</thead>
									{!data ? (
										<tbody>
											{getEmptyArray(16).map((_, i) => (
												<tr key={`table-loader-${i}`}>
													<th scope="row">
														<Skeleton />
													</th>
													<td>
														<Skeleton height={40} width={40} />
													</td>
													<td>
														<Skeleton height={18} width={19} />
													</td>
												</tr>
											))}
										</tbody>
									) : (
										<tbody>
											{data.getMyPicksForWeek.map(row => (
												<tr
													className={clsx(
														row.game.winnerTeam?.teamID &&
															row.game.winnerTeam.teamID === row.team?.teamID &&
															styles['correct-pick'],
														row.game.winnerTeam?.teamID &&
															row.game.winnerTeam.teamID !== row.team?.teamID &&
															styles['incorrect-pick'],
													)}
													key={`pick-for-game-${row.game.gameID}`}
												>
													<th scope="row">
														<div className="d-flex justify-content-start align-items-center">
															<Image
																alt={`${row.game.visitorTeam.teamCity} ${row.game.visitorTeam.teamName}`}
																height={40}
																layout="fixed"
																src={`/NFLLogos/${row.game.visitorTeam.teamLogo}`}
																title={`${row.game.visitorTeam.teamCity} ${row.game.visitorTeam.teamName}`}
																width={40}
															/>
															<div className="ps-1 d-none d-md-block">
																{row.game.visitorTeam.teamCity}{' '}
																{row.game.visitorTeam.teamName}
															</div>
															<FontAwesomeIcon className="mx-2" icon={faAt} />
															<Image
																alt={`${row.game.homeTeam.teamCity} ${row.game.homeTeam.teamName}`}
																height={40}
																layout="fixed"
																src={`/NFLLogos/${row.game.homeTeam.teamLogo}`}
																title={`${row.game.homeTeam.teamCity} ${row.game.homeTeam.teamName}`}
																width={40}
															/>
															<div className="ps-1 d-none d-md-block">
																{row.game.homeTeam.teamCity} {row.game.homeTeam.teamName}
															</div>
														</div>
													</th>
													<td className="text-center">
														{row.team && (
															<Image
																alt={`${row.team.teamCity} ${row.team.teamName}`}
																height={40}
																layout="fixed"
																src={`/NFLLogos/${row.team.teamLogo}`}
																title={`${row.team.teamCity} ${row.team.teamName}`}
																width={40}
															/>
														)}
													</td>
													<td className={clsx('text-center', styles.points)}>
														{row.pickPoints}
													</td>
												</tr>
											))}
										</tbody>
									)}
								</table>
							</div>
						</div>
					</div>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

ViewPicks.whyDidYouRender = true;

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
export default ViewPicks;
