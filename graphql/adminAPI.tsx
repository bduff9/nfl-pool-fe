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

import { ApiCall, ApiCallResult } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type APICallObject = Pick<
	ApiCall,
	| 'apiCallID'
	| 'apiCallError'
	| 'apiCallResponse'
	| 'apiCallUrl'
	| 'apiCallWeek'
	| 'apiCallYear'
	| 'createdAt'
>;

type LoadAdminAPICallsResponse = {
	loadAPICalls: Pick<ApiCallResult, 'count' | 'hasMore' | 'lastKey'> & {
		results: Array<APICallObject>;
	};
};

type LoadAdminAPICallsInput = {
	count: number;
	lastKey: null | string;
};

const query = gql`
	query LoadAPICalls($count: Int!, $lastKey: String) {
		loadAPICalls(Count: $count, LastKey: $lastKey) {
			count
			hasMore
			lastKey
			results {
				apiCallID
				apiCallError
				apiCallResponse
				apiCallUrl
				apiCallWeek
				apiCallYear
				createdAt
			}
		}
	}
`;

export const loadAPICalls = (
	count: number,
	lastKey: null | string,
): Promise<LoadAdminAPICallsResponse> =>
	fetcher<LoadAdminAPICallsResponse, LoadAdminAPICallsInput>(query, {
		count,
		lastKey,
	});
