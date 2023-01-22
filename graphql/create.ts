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
import type { User } from '../generated/graphql';

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

const getCurrentUserQuery = `
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

export const useCurrentUser = () => ({
	data: {
		getCurrentUser: {} as Pick<
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
		>,
		getCurrentUserQuery,
		hasGoogle: true,
		hasTwitter: true,
	},
	error: null,
	isValidating: false,
	mutate: (a?: (c: any) => any, b?: boolean): any => {
		console.log(a, b);
	},
});
