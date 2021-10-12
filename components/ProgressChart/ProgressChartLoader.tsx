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
import React, { VFC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProgressChartLoader: VFC = () => {
	return (
		<>
			{/* Progress Bar Chart */}
			<div className="text-start">
				<Skeleton height={16} width={75} />
			</div>
			<Skeleton height={28} />
			<div className="d-flex justify-content-between mb-1">
				<Skeleton height={8} width={125} />
				<Skeleton height={8} width={31} />
			</div>
		</>
	);
};

ProgressChartLoader.whyDidYouRender = true;

export default ProgressChartLoader;
