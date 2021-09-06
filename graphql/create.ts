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

import { User } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type CurrentUser = Pick<
	User,
	| 'userID'
	| 'userName'
	| 'userEmail'
	| 'userFirstName'
	| 'userLastName'
	| 'userTeamName'
	| 'userPhone'
	| 'userPaymentType'
	| 'userPaymentAccount'
	| 'userPlaysSurvivor'
	| 'userAutoPicksLeft'
	| 'userAutoPickStrategy'
	| 'userReferredByRaw'
	| 'userTrusted'
	| 'userDoneRegistering'
>;

export type CurrentUserResponse = {
	getCurrentUser: CurrentUser;
	hasGoogle: boolean;
	hasTwitter: boolean;
};

const getCurrentUserQuery = gql`
	query CurrentUser {
		getCurrentUser {
			userID
			userName
			userEmail
			userFirstName
			userLastName
			userTeamName
			userPhone
			userPaymentAccount
			userPaymentType
			userPlaysSurvivor
			userAutoPicksLeft
			userAutoPickStrategy
			userReferredByRaw
			userTrusted
			userDoneRegistering
		}
		hasGoogle: hasSocialLinked(Type: "google")
		hasTwitter: hasSocialLinked(Type: "twitter")
	}
`;

export const useCurrentUser = (): SWRResponse<CurrentUserResponse, ClientError> =>
	useSWR<CurrentUserResponse, ClientError>(getCurrentUserQuery, fetcher);
