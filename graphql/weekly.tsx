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
import type { WeeklyMv } from "../generated/graphql";

export type WeeklyRank = Pick<
  WeeklyMv,
  | "rank"
  | "tied"
  | "userID"
  | "userName"
  | "teamName"
  | "pointsEarned"
  | "gamesCorrect"
  | "tiebreakerScore"
  | "lastScore"
  | "isEliminated"
>;

const query = `
  query WeeklyRankings($week: Int!) {
    getWeeklyRankings(Week: $week) {
      rank
      tied
      userID
      userName
      teamName
      pointsEarned
      gamesCorrect
      tiebreakerScore
      lastScore
      isEliminated
    }
  }
`;

export const useWeeklyRankings = (week: number) => ({
  data: { getWeeklyRankings: [] as Array<WeeklyRank>, query, week },
  error: null,
  isValidating: false,
});
