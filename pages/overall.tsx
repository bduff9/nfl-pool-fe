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
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../components/Authenticated/Authenticated';
import CustomHead from '../components/CustomHead/CustomHead';
import ProgressChart from '../components/ProgressChart/ProgressChart';
import ProgressChartLoader from '../components/ProgressChart/ProgressChartLoader';
import RankingPieChart from '../components/RankingPieChart/RankingPieChart';
import RankingPieChartLoader from '../components/RankingPieChart/RankingPieChartLoader';
import { SeasonStatus } from '../generated/graphql';
import { useOverallRankings } from '../graphql/overall';
import { useOverallDashboard } from '../graphql/overallDashboard';
import { TUser } from '../models/User';
import {
	isDoneRegisteringSSR,
	isSignedInSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
	UNAUTHENTICATED_REDIRECT,
} from '../utils/auth.server';

type OverallRankingsProps = {
	user: TUser;
};

const OverallRankings: FC<OverallRankingsProps> = ({ user }) => {
	const router = useRouter();
	const { data, error, isValidating } = useOverallRankings();
	const { data: myData, error: myError } = useOverallDashboard();
	const myPlace = `${myData?.getMyOverallDashboard?.tied ? 'T' : ''}${
		myData?.getMyOverallDashboard?.rank
	}`;
	const total = myData?.getOverallRankingsTotalCount ?? 0;
	const me = myData?.getMyOverallDashboard?.rank ?? 0;
	const tiedWithMe = myData?.getOverallTiedWithMeCount ?? 0;
	const aheadOfMe = me - 1;
	const behindMe = total - me - tiedWithMe;

	if (error || myError) {
		console.error('Error when loading overall ranks', error, myError);
		// throw error;
	}

	if (!isValidating && data?.getOverallRankings.length === 0) {
		router.replace('/');

		return null;
	}

	return (
		<Authenticated isRegistered>
			<CustomHead title="Overall Ranks" />
			<div className="content-bg text-dark my-3 mx-2 pt-0 pt-md-3 min-vh-100 pb-4 col">
				<SkeletonTheme>
					<div className="row">
						<div
							className="d-none d-md-inline-block col-6 text-center"
							style={{ height: '205px' }}
						>
							<motion.h2 className="mb-0" layoutId="overallRankTitle">
								Overall Rank
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
									layoutId="overallRankingPieChart"
								/>
							)}
						</div>
						<div className="d-none d-md-inline-block col-6">
							<motion.h2 className="mb-4 text-center" layoutId="myOverallResultsTitle">
								My Overall Results
							</motion.h2>
							{!myData || myData.getMyOverallDashboard === null ? (
								<>
									<ProgressChartLoader />
									<ProgressChartLoader />
								</>
							) : (
								<>
									<ProgressChart
										correct={myData.getMyOverallDashboard.pointsEarned}
										incorrect={myData.getMyOverallDashboard.pointsWrong}
										isOver={myData.getWeek.seasonStatus === SeasonStatus.Complete}
										layoutId="overallPointsEarned"
										max={myData.getMyOverallDashboard.pointsTotal}
										type="Points"
									/>
									<ProgressChart
										correct={myData.getMyOverallDashboard.gamesCorrect}
										incorrect={myData.getMyOverallDashboard.gamesWrong}
										isOver={myData.getWeek.seasonStatus === SeasonStatus.Complete}
										layoutId="overallGamesCorrect"
										max={myData.getMyOverallDashboard.gamesTotal}
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
										<th scope="col">Missed Games?</th>
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
											</tr>
										))}
									</tbody>
								) : (
									<tbody>
										{data.getOverallRankings.map(row => (
											<tr
												className={clsx(row.userID === user.id && 'table-warning')}
												key={`user-rank-for-${row.userID}`}
											>
												<th scope="row">{row.rank}</th>
												<td>{row.teamName}</td>
												<td>{row.userName}</td>
												<td>{row.pointsEarned}</td>
												<td>{row.gamesCorrect}</td>
												<td
													className="text-danger"
													title={`Missed games: ${row.gamesMissed}`}
												>
													{row.gamesMissed > 0 ? <b>X</b> : ''}
												</td>
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

OverallRankings.whyDidYouRender = true;

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
export default OverallRankings;
