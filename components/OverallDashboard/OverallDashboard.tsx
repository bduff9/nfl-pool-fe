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
import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { VFC, useContext, useEffect } from 'react';

import { SeasonStatus } from '../../generated/graphql';
import { useOverallCounts, useOverallDashboard } from '../../graphql/overallDashboard';
import ProgressChart from '../ProgressChart/ProgressChart';
import RankingPieChart from '../RankingPieChart/RankingPieChart';
import { BackgroundLoadingContext } from '../../utils/context';
import { useCurrentWeek } from '../../graphql/sidebar';
import { logger } from '../../utils/logging';

import OverallDashboardLoader from './OverallDashboardLoader';
import styles from './OverallDashboard.module.scss';

const OverallDashboard: VFC = () => {
	const { data, error, isValidating } = useOverallDashboard();
	const {
		data: currentWeekData,
		error: currentWeekError,
		isValidating: currentWeekIsValidating,
	} = useCurrentWeek();
	const {
		data: overallCountData,
		error: overallCountError,
		isValidating: overallCountIsValidating,
	} = useOverallCounts();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
	const myPlace = `${data?.getMyOverallDashboard?.tied ? 'T' : ''}${
		data?.getMyOverallDashboard?.rank
	}`;
	const total = overallCountData?.getOverallRankingsTotalCount ?? 0;
	const me = data?.getMyOverallDashboard?.rank ?? 0;
	const tiedWithMe = overallCountData?.getOverallTiedWithMeCount ?? 0;
	const aheadOfMe = me - 1;
	const behindMe = total - me - tiedWithMe;

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) ||
				(!!currentWeekData && currentWeekIsValidating) ||
				(!!overallCountData && overallCountIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		data,
		isValidating,
		currentWeekData,
		currentWeekIsValidating,
		overallCountData,
		overallCountIsValidating,
	]);

	if (error) {
		logger.error({ text: 'Error when loading overall dashboard: ', error });
	}

	if (currentWeekError) {
		logger.error({ text: 'Error when loading current week: ', currentWeekError });
	}

	if (overallCountError) {
		logger.error({ text: 'Error when loading overall counts: ', overallCountError });
	}

	return (
		<div
			className={clsx(
				'col-md-4',
				'text-center',
				'mb-3',
				'mb-md-0',
				styles['overall-dashboard'],
			)}
		>
			<motion.h2 className="mb-0" layoutId="overallRankTitle">
				Overall Rank
			</motion.h2>
			{!data ? (
				<OverallDashboardLoader />
			) : data.getMyOverallDashboard === null ? (
				<div>Season has not started yet!</div>
			) : (
				<div>
					<div className={clsx(styles['overall-links'])}>
						<Link href="/overall">
							<a className="d-md-inline-block">View Details</a>
						</Link>
					</div>
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
					<motion.h2
						className={clsx('mt-5', styles['overall-results'])}
						layoutId="myOverallResultsTitle"
					>
						My Overall Results
					</motion.h2>
					<ProgressChart
						correct={data.getMyOverallDashboard.pointsEarned}
						incorrect={data.getMyOverallDashboard.pointsWrong}
						isOver={currentWeekData?.getWeek.seasonStatus === SeasonStatus.Complete}
						layoutId="overallPointsEarned"
						max={data.getMyOverallDashboard.pointsTotal}
						type="Points"
					/>
					<ProgressChart
						correct={data.getMyOverallDashboard.gamesCorrect}
						incorrect={data.getMyOverallDashboard.gamesWrong}
						isOver={currentWeekData?.getWeek.seasonStatus === SeasonStatus.Complete}
						layoutId="overallGamesCorrect"
						max={data.getMyOverallDashboard.gamesTotal}
						type="Games"
					/>
				</div>
			)}
		</div>
	);
};

OverallDashboard.whyDidYouRender = true;

export default OverallDashboard;
