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
import { gql } from 'graphql-request';
import useSWR, { SWRResponse } from 'swr';

import { Tiebreaker, Week, WeeklyMv } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetWeeklyDashboardResponse = {
	getMyWeeklyDashboard: null | Pick<
		WeeklyMv,
		| 'rank'
		| 'tied'
		| 'pointsEarned'
		| 'pointsWrong'
		| 'pointsPossible'
		| 'pointsTotal'
		| 'gamesCorrect'
		| 'gamesWrong'
		| 'gamesPossible'
		| 'gamesTotal'
		| 'gamesMissed'
		| 'isEliminated'
	>;
	getWeeklyTiedWithMeCount: number;
	getWeeklyRankingsTotalCount: number;
	getMyTiebreakerForWeek: Pick<Tiebreaker, 'tiebreakerHasSubmitted'>;
	selectedWeek: Pick<Week, 'weekNumber' | 'weekStarts' | 'weekStatus'>;
};

const query = gql`
	query WeeklyDashboard($week: Int!) {
		getMyWeeklyDashboard(Week: $week) {
			rank
			tied
			pointsEarned
			pointsWrong
			pointsPossible
			pointsTotal
			gamesCorrect
			gamesWrong
			gamesPossible
			gamesTotal
			gamesMissed
			isEliminated
		}
		getWeeklyTiedWithMeCount(Week: $week)
		getWeeklyRankingsTotalCount(Week: $week)
		getMyTiebreakerForWeek(Week: $week) {
			tiebreakerHasSubmitted
		}
		selectedWeek: getWeek(Week: $week) {
			weekNumber
			weekStarts
			weekStatus
		}
	}
`;

export const useWeeklyDashboard = (
	week: number,
): SWRResponse<GetWeeklyDashboardResponse, unknown> =>
	useSWR<GetWeeklyDashboardResponse>([query, week], (query, week) =>
		fetcher(query, { week }),
	);
