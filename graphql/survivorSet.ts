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
import type { SWRResponse } from 'swr';

import { Game, SurvivorPick, Team } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type SetSurvivorPick = Pick<SurvivorPick, 'survivorPickWeek'> & {
	team: null | Pick<Team, 'teamID'>;
};

type MakeSurvivorPickViewResponse = {
	getWeekInProgress: null | number;
	getMySurvivorPicks: Array<SetSurvivorPick>;
	getTeamsOnBye: Array<Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>>;
};

const query = gql`
	query MakeSurvivorPickView($week: Int!) {
		getWeekInProgress
		getMySurvivorPicks {
			survivorPickWeek
			team {
				teamID
			}
		}
		getTeamsOnBye(Week: $week) {
			teamID
			teamCity
			teamName
			teamLogo
		}
	}
`;

export const useMakeSurvivorPickView = (
	week: number,
): SWRResponse<MakeSurvivorPickViewResponse, ClientError> =>
	useSWR<MakeSurvivorPickViewResponse, ClientError>(
		[query, week],
		(): Promise<MakeSurvivorPickViewResponse> => fetcher(query, { week }),
	);

type MakePickMutationResult = {
	makeSurvivorPick: Pick<SurvivorPick, 'survivorPickID' | 'survivorPickWeek'> & {
		game: Pick<Game, 'gameID'>;
		team: Pick<Team, 'teamID'>;
	};
};
type MakePickMutationInput = {
	gameID: number;
	teamID: number;
	week: number;
};

const mutation = gql`
	mutation MakeSurvivorPick($week: Int!, $gameID: Int!, $teamID: Int!) {
		makeSurvivorPick(data: { survivorPickWeek: $week, gameID: $gameID, teamID: $teamID }) {
			survivorPickID
			survivorPickWeek
			game {
				gameID
			}
			team {
				teamID
			}
		}
	}
`;

export const makeSurvivorPick = async (
	week: number,
	gameID: number,
	teamID: number,
): Promise<MakePickMutationResult> =>
	fetcher<MakePickMutationResult, MakePickMutationInput>(mutation, {
		gameID,
		teamID,
		week,
	});
