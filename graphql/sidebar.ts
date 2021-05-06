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
import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { Tiebreaker, Week } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

const getSidebarGQL = gql`
	query GetSidebar($week: Int!) {
		currentWeek: getWeek {
			weekNumber
			weekStarts
			weekStatus
		}
		selectedWeek: getWeek(Week: $week) {
			weekNumber
			weekStarts
			weekStatus
		}
		getMyTiebreakerForWeek(Week: $week) {
			tiebreakerHasSubmitted
		}
		isAliveInSurvivor
	}
`;

type GetWeekResponse = Pick<Week, 'weekNumber' | 'weekStarts' | 'weekStatus'>;
type GetMyTiebreakerResponse = Pick<Tiebreaker, 'tiebreakerHasSubmitted'>;
type GetSidebarResponse = {
	currentWeek: GetWeekResponse;
	selectedWeek: GetWeekResponse;
	getMyTiebreakerForWeek: GetMyTiebreakerResponse;
	isAliveInSurvivor: boolean;
};

export const useSidebarData = (
	doneRegistering: boolean | undefined,
	selectedWeek: number,
): SWRResponse<GetSidebarResponse, any> => {
	const getSidebarVars = useMemo(() => {
		let week = selectedWeek;

		if (week < 1) week = 1;

		if (week > 18) week = 18;

		return { week };
	}, [selectedWeek]);
	const result = useSWR<GetSidebarResponse>(
		doneRegistering ? [getSidebarGQL, getSidebarVars] : null,
		fetcher,
	);

	return result;
};
