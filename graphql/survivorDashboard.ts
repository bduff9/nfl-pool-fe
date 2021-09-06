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
import { ClientError, gql } from 'graphql-request';
import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';

import { SeasonStatus, Team } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetSurvivorDashboardResponse = {
	survivorAliveForWeek: number;
	survivorDeadForWeek: number;
	survivorWaitingForWeek: number;
	getSurvivorWeekCount: number;
	survivorAliveOverall: number;
	survivorDeadOverall: number;
	getSurvivorOverallCount: number;
	getMySurvivorDashboard: null | {
		isAliveOverall: boolean;
		lastPickTeam: Pick<Team, 'teamCity' | 'teamLogo' | 'teamName'>;
	};
	getMySurvivorPickForWeek: null | {
		team: Pick<Team, 'teamCity' | 'teamLogo' | 'teamName'>;
	};
	getSurvivorStatus: SeasonStatus;
};

const getSurvivorDashboardQuery = gql`
	query GetSurvivorDashboard($week: Int!) {
		survivorAliveForWeek: getSurvivorWeekCount(Type: Alive)
		survivorDeadForWeek: getSurvivorWeekCount(Type: Dead)
		survivorWaitingForWeek: getSurvivorWeekCount(Type: Waiting)
		getSurvivorWeekCount
		survivorAliveOverall: getSurvivorOverallCount(Type: true)
		survivorDeadOverall: getSurvivorOverallCount(Type: false)
		getSurvivorOverallCount
		getMySurvivorDashboard {
			isAliveOverall
			lastPickTeam {
				teamCity
				teamLogo
				teamName
			}
		}
		getMySurvivorPickForWeek(Week: $week) {
			team {
				teamCity
				teamLogo
				teamName
			}
		}
		getSurvivorStatus
	}
`;

export const useSurvivorDashboard = (
	week: number,
): SWRResponse<GetSurvivorDashboardResponse, unknown> => {
	const result = useSWR<GetSurvivorDashboardResponse>(
		[getSurvivorDashboardQuery, week],
		(query, week) => fetcher(query, { week }),
	);

	return result;
};

type SurvivorIsAliveResponse = {
	isAliveInSurvivor: boolean;
};

const getSurvivorIsAliveQuery = gql`
	query SurvivorIsAlive {
		isAliveInSurvivor
	}
`;

export const useSurvivorIsAlive = (): SWRResponse<SurvivorIsAliveResponse, ClientError> =>
	useSWR<SurvivorIsAliveResponse, ClientError>(getSurvivorIsAliveQuery, fetcher);
