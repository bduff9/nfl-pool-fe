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
import { ClientError, gql } from 'graphql-request';
import useSWR from 'swr';
import type { Fetcher, SWRResponse } from 'swr';

import { WeeklyMv } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type WeeklyRank = Pick<
	WeeklyMv,
	| 'rank'
	| 'tied'
	| 'userID'
	| 'userName'
	| 'teamName'
	| 'pointsEarned'
	| 'gamesCorrect'
	| 'tiebreakerScore'
	| 'lastScore'
	| 'isEliminated'
>;

type GetWeeklyRankingsResponse = {
	getWeeklyRankings: Array<WeeklyRank>;
};

const query = gql`
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

const weeklyRankingsFetcher: Fetcher<GetWeeklyRankingsResponse, [string, number]> = ([
	query,
	week,
]) => fetcher(query, { week });

export const useWeeklyRankings = (
	week: number,
): SWRResponse<GetWeeklyRankingsResponse, ClientError> =>
	useSWR<GetWeeklyRankingsResponse>([query, week], weeklyRankingsFetcher);
