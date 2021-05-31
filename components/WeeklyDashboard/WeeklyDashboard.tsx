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
import Link from 'next/link';
import React, { FC, useContext } from 'react';

import { WeekStatus } from '../../generated/graphql';
import { useWeeklyDashboard } from '../../graphql/weeklyDashboard';
import { WeekContext } from '../../utils/context';
import { useCountdown } from '../../utils/hooks';
import OverallDashboardLoader from '../OverallDashboard/OverallDashboardLoader';
import ProgressChart from '../ProgressChart/ProgressChart';
import RankingPieChart from '../RankingPieChart/RankingPieChart';

import styles from './WeeklyDashboard.module.scss';

const WeeklyDashboard: FC = () => {
	const [selectedWeek] = useContext(WeekContext);
	const { data, error } = useWeeklyDashboard(selectedWeek);
	const timeRemaining = useCountdown(
		data?.selectedWeek.weekStarts ? new Date(data?.selectedWeek.weekStarts) : null,
	);
	const myPlace = `${data?.getMyWeeklyDashboard?.tied ? 'T' : ''}${
		data?.getMyWeeklyDashboard?.rank
	}`;
	const total = data?.getWeeklyRankingsTotalCount ?? 0;
	const me = data?.getMyWeeklyDashboard?.rank ?? 0;
	const tiedWithMe = data?.getWeeklyTiedWithMeCount ?? 0;
	const aheadOfMe = me - 1;
	const behindMe = total - me - tiedWithMe;

	if (error) {
		console.error(`Error when loading week ${selectedWeek} dashboard`, error);
		throw error;
	}

	return (
		<div
			className={clsx(
				'col-md-4',
				'text-center',
				'mb-3',
				'mb-md-0',
				styles['weekly-dashboard'],
			)}
		>
			<motion.h2 className="mb-0" layoutId="weeklyRankTitle">
				Week {selectedWeek} Rank
			</motion.h2>
			{data && (
				<>
					{data.getMyTiebreakerForWeek.tiebreakerHasSubmitted ? (
						<>
							<div className="text-success">You have submitted your picks</div>
							<Link href="/picks/view">
								<a>View my picks</a>
							</Link>
						</>
					) : (
						<>
							<div className="text-danger">You have not submitted your picks yet!</div>
							<Link href="/picks/set">
								<a>Make my picks</a>
							</Link>
						</>
					)}
				</>
			)}
			{!data ? (
				<OverallDashboardLoader />
			) : data.getMyWeeklyDashboard === null ? (
				<h3 className="mt-5">{timeRemaining || 'Week has started'}</h3>
			) : (
				<div>
					<Link href="/weekly">
						<a>View Details</a>
					</Link>
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
					<motion.h2 className="mt-5" layoutId="myWeeklyResultsTitle">
						My Week {selectedWeek} Results
					</motion.h2>
					<ProgressChart
						correct={data.getMyWeeklyDashboard.pointsEarned}
						incorrect={data.getMyWeeklyDashboard.pointsWrong}
						isOver={data.selectedWeek.weekStatus === WeekStatus.Complete}
						layoutId="weeklyPointsEarned"
						max={data.getMyWeeklyDashboard.pointsTotal}
						type="Points"
					/>
					<ProgressChart
						correct={data.getMyWeeklyDashboard.gamesCorrect}
						incorrect={data.getMyWeeklyDashboard.gamesWrong}
						isOver={data.selectedWeek.weekStatus === WeekStatus.Complete}
						layoutId="weeklyGamesCorrect"
						max={data.getMyWeeklyDashboard.gamesTotal}
						type="Games"
					/>
				</div>
			)}
		</div>
	);
};

WeeklyDashboard.whyDidYouRender = true;

export default WeeklyDashboard;
