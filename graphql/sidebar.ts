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
