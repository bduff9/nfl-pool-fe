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
import React, { FC } from 'react';

import styles from './ProgressChart.module.scss';

type ProgressChartProps = {
	correct: number;
	incorrect: number;
	isOver?: boolean;
	layoutId: string;
	max: number;
	type: 'Games' | 'Points';
};

const ProgressChart: FC<ProgressChartProps> = ({
	correct,
	incorrect,
	isOver = false,
	layoutId,
	max,
	type,
}) => {
	const correctPercent = (correct / max) * 100;
	const incorrectPercent = (incorrect / max) * 100;

	return (
		<motion.div layoutId={layoutId}>
			<div className="text-start">{type}</div>
			<div className={clsx('progress', styles['custom-progress'])}>
				<div
					className={clsx(
						'progress-bar',
						!isOver && 'progress-bar-striped',
						!isOver && 'progress-bar-animated',
						'bg-success',
					)}
					role="progressbar"
					style={{ width: `${correctPercent}%` }}
					aria-valuenow={correct}
					aria-valuemin={0}
					aria-valuemax={max}
				>
					{correct}
				</div>
				<div
					className={clsx(
						'progress-bar',
						!isOver && 'progress-bar-striped',
						!isOver && 'progress-bar-animated',
						'bg-danger',
					)}
					role="progressbar"
					style={{ width: `${incorrectPercent}%` }}
					aria-valuenow={incorrect}
					aria-valuemin={0}
					aria-valuemax={max}
				>
					{incorrect}
				</div>
			</div>
			<div className="small d-flex justify-content-between mb-2">
				<div>Max possible {type.toLowerCase()}</div>
				<div>{max}</div>
			</div>
		</motion.div>
	);
};

ProgressChart.whyDidYouRender = true;

export default ProgressChart;
