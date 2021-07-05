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

import { SeasonStatus, WeekStatus } from '../../generated/graphql';
import { useSurvivorDashboard } from '../../graphql/survivorDashboard';
import { TUser } from '../../models/User';
import { WeekContext } from '../../utils/context';
import OverallDashboardLoader from '../OverallDashboard/OverallDashboardLoader';
import ProgressChart from '../ProgressChart/ProgressChart';
import SurvivorDashboardIcon from '../SurvivorDashboardIcon/SurvivorDashboardIcon';

import styles from './SurvivorDashboard.module.scss';

type SurvivorDashboardProps = {
	user: TUser;
};

const SurvivorDashboard: FC<SurvivorDashboardProps> = ({ user }) => {
	const [selectedWeek] = useContext(WeekContext);
	const { data, error } = useSurvivorDashboard(selectedWeek);

	if (error) {
		console.error('Error when loading survivor dashboard', error);
	}

	return (
		<div
			className={clsx(
				'col-md-4',
				'text-center',
				'mb-3',
				'mb-md-0',
				styles['survivor-dashboard'],
			)}
		>
			<motion.h2 className="mb-0" layoutId="survivorPoolTitle">
				Survivor Pool
			</motion.h2>
			{!data ? (
				<OverallDashboardLoader />
			) : (
				<div>
					<Link href="/survivor/view">
						<a
							className={clsx(
								'd-md-block',
								(!user.hasSurvivor || data.getMySurvivorPickForWeek?.team) &&
									styles['survivor-link'],
							)}
						>
							View Details
						</a>
					</Link>
					{user.hasSurvivor && !data.getMySurvivorPickForWeek?.team && (
						<Link href="/survivor/set">
							<a className={clsx('d-md-inline-block')}>Click here to make your pick</a>
						</Link>
					)}
					<SurvivorDashboardIcon
						isAlive={data.getMySurvivorDashboard?.isAliveOverall}
						isPlaying={user.hasSurvivor}
						lastPick={data.getMySurvivorDashboard?.lastPickTeam}
						pickForWeek={data.getMySurvivorPickForWeek?.team}
					/>

					{data.getSurvivorStatus !== SeasonStatus.NotStarted && (
						<>
							<motion.h2
								className={styles['results-title']}
								layoutId="survivorPoolResultsTitle"
							>
								Survivor Pool Results
							</motion.h2>
							<ProgressChart
								correct={data.survivorAliveForWeek}
								incorrect={data.survivorDeadForWeek}
								inProgress={data.survivorWaitingForWeek}
								isOver={data.getWeek.weekStatus === WeekStatus.Complete}
								layoutId="survivorWeekStatus"
								max={data.getSurvivorWeekCount}
								type="Current Week Remaining"
							/>
							<ProgressChart
								correct={data.survivorAliveOverall}
								incorrect={data.survivorDeadOverall}
								isOver={data.getSurvivorStatus === SeasonStatus.Complete}
								layoutId="survivorOverallStatus"
								max={data.getSurvivorOverallCount}
								type="Overall Remaining"
							/>
						</>
					)}
				</div>
			)}
		</div>
	);
};

SurvivorDashboard.whyDidYouRender = true;

export default SurvivorDashboard;
