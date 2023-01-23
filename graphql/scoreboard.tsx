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
import type { Fetcher } from 'swr';

import { Game, Team } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type GameForWeek = Pick<
	Game,
	| 'gameHomeScore'
	| 'gameID'
	| 'gameKickoff'
	| 'gameStatus'
	| 'gameTimeLeftInQuarter'
	| 'gameVisitorScore'
> & {
	homeTeam: Pick<Team, 'teamCity' | 'teamID' | 'teamLogo' | 'teamName' | 'teamShortName'>;
	visitorTeam: Pick<
		Team,
		'teamCity' | 'teamID' | 'teamLogo' | 'teamName' | 'teamShortName'
	>;
	winnerTeam: null | Pick<Team, 'teamID'>;
	teamHasPossession: null | Pick<Team, 'teamID'>;
	teamInRedzone: null | Pick<Team, 'teamID'>;
};

type GetGamesForWeekResponse = {
	getGamesForWeek: Array<GameForWeek>;
};

const query = gql`
	query GetGamesForWeek($week: Int!) {
		getGamesForWeek(Week: $week) {
			gameID
			gameStatus
			gameKickoff
			homeTeam {
				teamID
				teamCity
				teamName
				teamShortName
				teamLogo
			}
			gameHomeScore
			visitorTeam {
				teamID
				teamCity
				teamName
				teamShortName
				teamLogo
			}
			gameVisitorScore
			winnerTeam {
				teamID
			}
			gameTimeLeftInQuarter
			teamHasPossession {
				teamID
			}
			teamInRedzone {
				teamID
			}
		}
	}
`;

const gamesForWeekFetcher: Fetcher<GetGamesForWeekResponse, [string, number]> = ([
	query,
	week,
]) => fetcher(query, { week });

export const useGamesForWeek = (week: number) =>
	useSWR<GetGamesForWeekResponse, ClientError>([query, week], gamesForWeekFetcher, {
		refreshInterval: 60000,
	});
