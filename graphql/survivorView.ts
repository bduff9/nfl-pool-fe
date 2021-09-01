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

import { SurvivorMv, SurvivorPick, Team } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetSurvivorViewResponse = {
	getSurvivorRankings: Array<
		Pick<SurvivorMv, 'userID' | 'userName' | 'teamName' | 'isAliveOverall'> & {
			allPicks: Array<
				Pick<SurvivorPick, 'survivorPickWeek'> & {
					game: {
						winnerTeam: Pick<Team, 'teamID'>;
					};
					team: null | Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				}
			>;
		}
	>;
	getWeekInProgress: number;
};

const query = gql`
	query GetSurvivorView {
		getSurvivorRankings {
			userID
			userName
			teamName
			isAliveOverall
			allPicks {
				survivorPickWeek
				game {
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
		getWeekInProgress
	}
`;

export const useSurvivorView = (): SWRResponse<GetSurvivorViewResponse, unknown> =>
	useSWR<GetSurvivorViewResponse>(query, fetcher);
