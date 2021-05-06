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
import useSWR, { SWRResponse } from 'swr';

import { User } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

const getCurrentUserQuery = gql`
	query CurrentUser {
		getCurrentUser {
			userID
			userName
			userEmail
			userFirstName
			userLastName
			userTeamName
			userPaymentAccount
			userPaymentType
			userPlaysSurvivor
			userReferredByRaw
			userTrusted
		}
		hasGoogle: hasSocialLinked(Type: "google")
		hasTwitter: hasSocialLinked(Type: "twitter")
	}
`;

export type GetCurrentUserResponse = Pick<
	User,
	| 'userID'
	| 'userName'
	| 'userEmail'
	| 'userFirstName'
	| 'userLastName'
	| 'userTeamName'
	| 'userPaymentType'
	| 'userPaymentAccount'
	| 'userPlaysSurvivor'
	| 'userReferredByRaw'
	| 'userTrusted'
>;

export const useFinishRegistrationQuery = (): SWRResponse<
	{
		getCurrentUser: GetCurrentUserResponse;
		hasGoogle: boolean;
		hasTwitter: boolean;
	},
	unknown
> =>
	useSWR<{
		getCurrentUser: GetCurrentUserResponse;
		hasGoogle: boolean;
		hasTwitter: boolean;
	}>(getCurrentUserQuery, fetcher);
