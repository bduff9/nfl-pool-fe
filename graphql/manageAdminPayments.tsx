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

import { SystemValue } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetPayoutAmountsResponse = {
	weeklyPrizes: Pick<SystemValue, 'systemValueValue'> | null;
	overallPrizes: Pick<SystemValue, 'systemValueValue'> | null;
	survivorPrizes: Pick<SystemValue, 'systemValueValue'> | null;
	poolCost: Pick<SystemValue, 'systemValueValue'> | null;
	survivorCost: Pick<SystemValue, 'systemValueValue'> | null;
	getRegisteredCount: number;
	getSurvivorCount: number;
};

const payoutAmountsQuery = gql`
	query GetPrizesForAdmin {
		weeklyPrizes: getSystemValue(Name: "WeeklyPrizes") {
			systemValueValue
		}
		overallPrizes: getSystemValue(Name: "OverallPrizes") {
			systemValueValue
		}
		survivorPrizes: getSystemValue(Name: "SurvivorPrizes") {
			systemValueValue
		}
		poolCost: getSystemValue(Name: "PoolCost") {
			systemValueValue
		}
		survivorCost: getSystemValue(Name: "SurvivorCost") {
			systemValueValue
		}
		getRegisteredCount
		getSurvivorCount
	}
`;

export const usePayoutAmounts = (): SWRResponse<GetPayoutAmountsResponse, ClientError> =>
	useSWR<GetPayoutAmountsResponse, ClientError>(payoutAmountsQuery, fetcher);

type SetPrizeAmountsResponse = {
	setPrizeAmounts: boolean;
};

type SetPrizeAmountsInput = {
	overallPrizes: string;
	survivorPrizes: string;
	weeklyPrizes: string;
};

const setPrizeAmountsMutation = gql`
	mutation SetPrizeAmounts(
		$weeklyPrizes: String!
		$overallPrizes: String!
		$survivorPrizes: String!
	) {
		setPrizeAmounts(
			WeeklyPrizes: $weeklyPrizes
			OverallPrizes: $overallPrizes
			SurvivorPrizes: $survivorPrizes
		)
	}
`;

export const setPrizeAmounts = async (
	weeklyPrizes: string,
	overallPrizes: string,
	survivorPrizes: string,
): Promise<SetPrizeAmountsResponse> =>
	fetcher<SetPrizeAmountsResponse, SetPrizeAmountsInput>(setPrizeAmountsMutation, {
		overallPrizes,
		survivorPrizes,
		weeklyPrizes,
	});
