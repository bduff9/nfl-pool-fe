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
import type { FC } from "react";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import ProgressChartLoader from "../ProgressChart/ProgressChartLoader";
import RankingPieChartLoader from "../RankingPieChart/RankingPieChartLoader";

const OverallDashboardLoader: FC = () => {
  return (
    <SkeletonTheme>
      {/* View Details link */}
      <div className="mb-3" style={{ marginTop: "42px" }}>
        <Skeleton height={18} width={87} />
      </div>
      {/* Pie Chart */}
      <RankingPieChartLoader />
      {/* H2 */}
      <Skeleton className="mt-5 h2" height={36} width={250} />
      {/* Points Bar */}
      <ProgressChartLoader />
      {/* Games Bar */}
      <ProgressChartLoader />
    </SkeletonTheme>
  );
};

export default OverallDashboardLoader;
