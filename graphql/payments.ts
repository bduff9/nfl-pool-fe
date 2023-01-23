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
import type { SWRResponse } from 'swr';

import { Payment } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetPaymentsResponse = {
	getMyPayments: Array<
		Pick<Payment, 'paymentDescription' | 'paymentWeek' | 'paymentAmount'>
	>;
};

const query = gql`
	query GetPayments {
		getMyPayments {
			paymentDescription
			paymentWeek
			paymentAmount
		}
	}
`;

export const useGetPayments = (): SWRResponse<GetPaymentsResponse, unknown> => {
	const result = useSWR<GetPaymentsResponse>(query, fetcher);

	return result;
};
