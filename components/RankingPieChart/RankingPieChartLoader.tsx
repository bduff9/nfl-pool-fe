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
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const RankingPieChartLoader: FC = () => {
	return (
		<>
			{/* Pie Chart */}
			<div>
				<Skeleton circle height={160} width={160} />
			</div>
			<div className="mt-2">
				<Skeleton height={19} width={66} />
			</div>
		</>
	);
};

RankingPieChartLoader.whyDidYouRender = true;

export default RankingPieChartLoader;
