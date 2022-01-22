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
import { gql } from 'graphql-request';
import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';

import { Game, Pick as PoolPick, Team } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetViewMyPicksResponse = {
	getMyPicksForWeek: Array<
		Pick<PoolPick, 'pickID' | 'pickPoints'> & {
			game: Pick<Game, 'gameID' | 'gameKickoff'> & {
				homeTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				visitorTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				winnerTeam: Pick<Team, 'teamID'> | null;
			};
			team: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'> | null;
		}
	>;
};

const query = gql`
	query ViewMyPicks($week: Int!) {
		getMyPicksForWeek(Week: $week) {
			pickID
			pickPoints
			game {
				gameID
				gameKickoff
				homeTeam {
					teamID
					teamCity
					teamName
					teamLogo
				}
				visitorTeam {
					teamID
					teamCity
					teamName
					teamLogo
				}
				winnerTeam {
					teamID
				}
			}
			team {
				teamID
				teamCity
				teamName
				teamLogo
			}
		}
	}
`;

export const useViewMyPicks = (
	week: number,
): SWRResponse<GetViewMyPicksResponse, unknown> =>
	useSWR<GetViewMyPicksResponse>([query, week], (query, week) => fetcher(query, { week }));
