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

import { Week } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetCurrentWeekResponse = {
	getWeek: Pick<Week, 'weekNumber' | 'seasonStatus'>;
};

const getCurrentWeekQuery = gql`
	query GetCurrentWeek {
		getWeek {
			weekNumber
			seasonStatus
		}
	}
`;

export const useCurrentWeek = (): SWRResponse<GetCurrentWeekResponse, unknown> =>
	useSWR<GetCurrentWeekResponse>(getCurrentWeekQuery, fetcher);

type GetSelectedWeekResponse = {
	getWeek: Pick<Week, 'weekNumber' | 'weekStarts' | 'weekStatus'>;
};

const getSelectedWeekQuery = gql`
	query GetSelectedWeek($week: Int!) {
		getWeek(Week: $week) {
			weekNumber
			weekStarts
			weekStatus
		}
	}
`;

export const useSelectedWeek = (
	week: number,
): SWRResponse<GetSelectedWeekResponse, ClientError> =>
	useSWR<GetSelectedWeekResponse, ClientError>(
		[getSelectedWeekQuery, week],
		(query, week) => fetcher(query, { week }),
	);

const registerForSurvivorMutation = gql`
	mutation RegisterUserForSurvivorPool {
		registerForSurvivor
	}
`;

export const registerForSurvivor = (): Promise<boolean> =>
	fetcher<boolean>(registerForSurvivorMutation);

const unregisterForSurvivorMutation = gql`
	mutation UnregisterUserForSurvivorPool {
		unregisterForSurvivor
	}
`;

export const unregisterForSurvivor = (): Promise<boolean> =>
	fetcher<boolean>(unregisterForSurvivorMutation);
