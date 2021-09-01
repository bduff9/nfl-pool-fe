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
import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';

import { OverallMv, Week } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetOverallDashboardResponse = {
	getMyOverallDashboard: null | Pick<
		OverallMv,
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
	getOverallTiedWithMeCount: number;
	getOverallRankingsTotalCount: number;
	getWeek: Pick<Week, 'seasonStatus'>;
};

const query = gql`
	query OverallDashboard {
		getMyOverallDashboard {
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
		getOverallTiedWithMeCount
		getOverallRankingsTotalCount
		getWeek {
			seasonStatus
		}
	}
`;

export const useOverallDashboard = (): SWRResponse<
	GetOverallDashboardResponse,
	unknown
> => {
	const result = useSWR<GetOverallDashboardResponse>(query, fetcher);

	return result;
};
