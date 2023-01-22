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
import clsx from "clsx";
import type { FC } from "react";
import React from "react";

import styles from "./MyProgressChart.module.scss";

type MyProgressChartProps = {
  correct: number;
  correctLabel: string;
  isOver?: boolean;
  max: number;
  maxLabel: string;
  possible: number;
  possibleLabel: string;
};

const MyProgressChart: FC<MyProgressChartProps> = ({
  correct,
  correctLabel,
  isOver = false,
  max,
  maxLabel,
  possible,
  possibleLabel,
}) => {
  const correctPercent = (correct / max) * 100;
  const possiblePercent = ((possible - correct) / max) * 100;

  return (
    <div>
      <div className="text-end text-muted">{max}</div>
      <div className={clsx("progress", "mb-2", styles["custom-progress"])}>
        <div
          className={clsx(
            "progress-bar",
            !isOver && "progress-bar-striped",
            !isOver && "progress-bar-animated",
            styles.correct,
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
            "progress-bar",
            !isOver && "progress-bar-striped",
            !isOver && "progress-bar-animated",
            styles.possible,
          )}
          role="progressbar"
          style={{ width: `${possiblePercent}%` }}
          aria-valuenow={possible}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {possible}
        </div>
      </div>
      <div className="small d-flex justify-content-between">
        <div>
          <div className={clsx(styles.correct, styles.key)}></div> {correctLabel}
        </div>
        <div>
          <div className={clsx(styles.possible, styles.key)}></div> {possibleLabel}
        </div>
        <div>
          <div className={clsx(styles.max, styles.key)}></div> {maxLabel}
        </div>
      </div>
    </div>
  );
};

export default MyProgressChart;
