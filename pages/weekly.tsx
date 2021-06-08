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
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../components/Authenticated/Authenticated';
import CustomHead from '../components/CustomHead/CustomHead';
import ProgressChart from '../components/ProgressChart/ProgressChart';
import ProgressChartLoader from '../components/ProgressChart/ProgressChartLoader';
import RankingPieChart from '../components/RankingPieChart/RankingPieChart';
import RankingPieChartLoader from '../components/RankingPieChart/RankingPieChartLoader';
import { WeekStatus } from '../generated/graphql';
import { useWeeklyRankings } from '../graphql/weekly';
import { useWeeklyDashboard } from '../graphql/weeklyDashboard';
import { TUser } from '../models/User';
import {
	isDoneRegisteringSSR,
	isSignedInSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
	UNAUTHENTICATED_REDIRECT,
} from '../utils/auth.server';
import { WeekContext } from '../utils/context';

type WeeklyRankingsProps = {
	user: TUser;
};

const WeeklyRankings: FC<WeeklyRankingsProps> = ({ user }) => {
	const router = useRouter();
	const [selectedWeek] = useContext(WeekContext);
	const { data, error, isValidating } = useWeeklyRankings(selectedWeek);
	const { data: myData, error: myError } = useWeeklyDashboard(selectedWeek);
	const myPlace = `${myData?.getMyWeeklyDashboard?.tied ? 'T' : ''}${
		myData?.getMyWeeklyDashboard?.rank
	}`;
	const total = myData?.getWeeklyRankingsTotalCount ?? 0;
	const me = myData?.getMyWeeklyDashboard?.rank ?? 0;
	const tiedWithMe = myData?.getWeeklyTiedWithMeCount ?? 0;
	const aheadOfMe = me - 1;
	const behindMe = total - me - tiedWithMe;

	if (error || myError) {
		console.error('Error when loading overall ranks', error, myError);
		// throw error;
	}

	if (!isValidating && data?.getWeeklyRankings.length === 0) {
		router.replace('/');

		return null;
	}

	return (
		<Authenticated isRegistered>
			<CustomHead title={`Week ${selectedWeek} Ranks`} />
			<div className="content-bg text-dark my-3 mx-2 pt-0 pt-md-3 min-vh-100 pb-4 col">
				<SkeletonTheme>
					<div className="row">
						<div
							className="d-none d-md-inline-block col-6 text-center"
							style={{ height: '205px' }}
						>
							<motion.h2 className="mb-0" layoutId="weeklyRankTitle">
								Week {selectedWeek} Rank
							</motion.h2>
							{!myData ? (
								<div className="mt-4">
									<RankingPieChartLoader />
								</div>
							) : (
								<RankingPieChart
									data={[
										{
											fill: 'var(--bs-danger)',
											myPlace,
											name: 'ahead of me',
											total,
											value: aheadOfMe,
										},
										{
											fill: 'var(--bs-success)',
											myPlace,
											name: 'behind me',
											total,
											value: behindMe,
										},
										{
											fill: 'var(--bs-warning)',
											myPlace,
											name: 'tied with me',
											total,
											value: tiedWithMe,
										},
									]}
									layoutId="weeklyRankingPieChart"
								/>
							)}
						</div>
						<div className="mt-4 d-block d-md-none">
							<Link href="/">
								<a>&laquo; Back to Dashboard</a>
							</Link>
						</div>
						<div className="d-none d-md-inline-block col-6">
							<motion.h2 className="mb-4 text-center" layoutId="myWeeklyResultsTitle">
								My Week {selectedWeek} Results
							</motion.h2>
							{!myData || myData.getMyWeeklyDashboard === null ? (
								<>
									<ProgressChartLoader />
									<ProgressChartLoader />
								</>
							) : (
								<>
									<ProgressChart
										correct={myData.getMyWeeklyDashboard.pointsEarned}
										incorrect={myData.getMyWeeklyDashboard.pointsWrong}
										isOver={myData.selectedWeek.weekStatus === WeekStatus.Complete}
										layoutId="weeklyPointsEarned"
										max={myData.getMyWeeklyDashboard.pointsTotal}
										type="Points"
									/>
									<ProgressChart
										correct={myData.getMyWeeklyDashboard.gamesCorrect}
										incorrect={myData.getMyWeeklyDashboard.gamesWrong}
										isOver={myData.selectedWeek.weekStatus === WeekStatus.Complete}
										layoutId="weeklyGamesCorrect"
										max={myData.getMyWeeklyDashboard.gamesTotal}
										type="Games"
									/>
								</>
							)}
						</div>
						<div className="col-12 mt-4 table-responsive text-center">
							<table className="table table-striped table-hover">
								<thead>
									<tr>
										<th scope="col">Rank</th>
										<th scope="col">Team</th>
										<th scope="col">Owner</th>
										<th scope="col">Points</th>
										<th scope="col">Games Correct</th>
										<th scope="col">Tiebreaker</th>
										<th scope="col">Last Game</th>
										<th scope="col">Eliminated</th>
									</tr>
								</thead>
								{!data ? (
									<tbody>
										{Array.from({ length: 20 }).map((_, i) => (
											<tr key={`table-loader-${i}`}>
												<th scope="row">
													<Skeleton />
												</th>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
											</tr>
										))}
									</tbody>
								) : (
									<tbody>
										{data.getWeeklyRankings.map(row => (
											<tr
												className={clsx(row.userID === user.id && 'table-warning')}
												key={`user-rank-for-${row.userID}`}
											>
												<th scope="row">
													{row.tied ? 'T' : ''}
													{row.rank}
												</th>
												<td>{row.teamName}</td>
												<td>{row.userName}</td>
												<td>{row.pointsEarned}</td>
												<td>{row.gamesCorrect}</td>
												<td>{row.tiebreakerScore}</td>
												<td>{row.lastScore}</td>
												<td className="text-danger">{row.isEliminated && <b>X</b>}</td>
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

WeeklyRankings.whyDidYouRender = true;

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
export default WeeklyRankings;
