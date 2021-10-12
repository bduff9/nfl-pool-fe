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
import Image from 'next/image';
import React, { VFC } from 'react';
import Skeleton from 'react-loading-skeleton';

import { GameForWeek } from '../../graphql/scoreboard';
import { ViewAllPick } from '../../graphql/viewAll';
import { WeeklyRank } from '../../graphql/weekly';
import { getEmptyArray } from '../../utils/arrays';
import { getRandomInteger } from '../../utils/numbers';

import styles from './ViewAllTable.module.scss';

const DEFAULT_GAME_COUNT = 16;

type ViewAllTableProps = {
	games: Record<number, GameForWeek>;
	picks?: Array<ViewAllPick>;
	ranks?: Array<WeeklyRank>;
};

const ViewAllTable: VFC<ViewAllTableProps> = ({ games, picks, ranks }) => {
	return (
		<div className={clsx('rounded', 'table-responsive', styles['sticky-wrapper'])}>
			<table className="table table-hover table-bordered align-middle">
				<thead>
					<tr className={styles['sticky-row']}>
						<th className={styles.clear}></th>
						{getEmptyArray(Object.keys(games).length || DEFAULT_GAME_COUNT).map((_, i) => (
							<th className={styles.clear} key={`placeholder-for-game-${i}`}></th>
						))}
						<th className="text-center d-none d-md-table-cell" scope="col">
							Points Earned
						</th>
						<th className="text-center d-none d-md-table-cell" scope="col">
							Games Correct
						</th>
						<th className="text-center d-none d-md-table-cell" scope="col">
							Tiebreaker
						</th>
						<th className="text-center d-none d-md-table-cell" scope="col">
							Actual Score
						</th>
					</tr>
				</thead>
				{!picks || !ranks ? (
					<tbody className="content-bg">
						{getEmptyArray(20).map((_, i) => (
							<tr key={`table-loader-${i}`}>
								<th className={clsx(styles['sticky-col'], styles['solid-bg'])} scope="row">
									<Skeleton height={20} width={getRandomInteger(100, 150)} />
									<span className="d-none d-md-inline">
										<br />
										<Skeleton height={20} width={getRandomInteger(100, 150)} />
									</span>
								</th>
								{getEmptyArray(Object.keys(games).length || DEFAULT_GAME_COUNT).map(
									(_, i) => (
										<td className="text-center" key={`td-skeleton-${i}`}>
											<Skeleton height={60} width={60} />
											<Skeleton height={20} width={20} />
										</td>
									),
								)}
								<td className="d-none d-md-table-cell text-center">
									<Skeleton height={21} width={60} />
								</td>
								<td className="d-none d-md-table-cell text-center">
									<Skeleton height={21} width={60} />
								</td>
								<td className="d-none d-md-table-cell text-center">
									<Skeleton height={21} width={60} />
								</td>
								<td className="d-none d-md-table-cell text-center">
									<Skeleton height={21} width={60} />
								</td>
							</tr>
						))}
					</tbody>
				) : (
					<tbody className="content-bg">
						{ranks.map(user => {
							const userPicks = picks.filter(pick => pick.user.userID === user.userID);

							return (
								<tr key={`picks-for-user-${user.userID}`}>
									<th
										className={clsx(
											'text-nowrap',
											styles['sticky-col'],
											styles['solid-bg'],
										)}
										scope="row"
									>
										{user.tied && 'T'}
										{user.rank}. {user.userName}
										<div className="d-none d-md-block">
											<span className="invisible">
												{user.tied && 'T'}
												{user.rank}.
											</span>{' '}
											{user.teamName}
										</div>
										<div className="d-flex d-md-none fw-light justify-content-between">
											<div title="Points Earned">
												PE
												<br />
												{user.pointsEarned}
											</div>
											<div title="Games Correct">
												GC
												<br />
												{user.gamesCorrect}
											</div>
											<div title="My Tiebreaker">
												MT
												<br />
												{user.tiebreakerScore}
											</div>
											<div title="Actual Score">
												AS
												<br />
												{user.lastScore}
											</div>
										</div>
									</th>
									{userPicks.map(pick => {
										const game = games[pick.game.gameID];

										if (!game) {
											return (
												<td
													className="text-center"
													key={`td-skeleton-for-missing-game-${pick.game.gameID}`}
												>
													<Skeleton height={60} width={60} />
													<Skeleton height={20} width={20} />
												</td>
											);
										}

										return (
											<td
												className={clsx(
													'text-center',
													game.winnerTeam &&
														pick.team?.teamID === game.winnerTeam.teamID &&
														styles.correct,
													game.winnerTeam &&
														pick.team?.teamID !== game.winnerTeam.teamID &&
														styles.incorrect,
												)}
												key={`pick-${pick.pickID}`}
											>
												{pick.team ? (
													<Image
														alt={`${pick.team.teamCity} ${pick.team.teamName}`}
														height={60}
														layout="fixed"
														src={`/NFLLogos/${pick.team.teamLogo}`}
														title={`${pick.team.teamCity} ${pick.team.teamName}`}
														width={60}
													/>
												) : (
													<h4 className="mb-0">
														No
														<br />
														Pick
													</h4>
												)}
												{pick.pickPoints && (
													<>
														<br />
														{pick.pickPoints}
													</>
												)}
											</td>
										);
									})}
									<td className="d-none d-md-table-cell text-center">
										{user.pointsEarned}
									</td>
									<td className="d-none d-md-table-cell text-center">
										{user.gamesCorrect}
									</td>
									<td className="d-none d-md-table-cell text-center">
										{user.tiebreakerScore}
									</td>
									<td className="d-none d-md-table-cell text-center">{user.lastScore}</td>
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
		</div>
	);
};

ViewAllTable.whyDidYouRender = true;

export default ViewAllTable;
