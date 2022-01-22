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
import type { SWRResponse } from 'swr/dist/types';

import {
	Account,
	AdminUserType,
	Notification,
	NotificationType,
	User,
} from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type UserNotificationForAdmin = Pick<
	Notification,
	| 'notificationID'
	| 'notificationEmail'
	| 'notificationEmailHoursBefore'
	| 'notificationSMS'
	| 'notificationSMSHoursBefore'
> & {
	notificationDefinition: Pick<NotificationType, 'notificationTypeDescription'>;
};

export type UserForAdmin = Pick<
	User,
	| 'userID'
	| 'userEmail'
	| 'userName'
	| 'userFirstName'
	| 'userLastName'
	| 'userTeamName'
	| 'userReferredByRaw'
	| 'userEmailVerified'
	| 'userTrusted'
	| 'userDoneRegistering'
	| 'userPlaysSurvivor'
	| 'userPaid'
	| 'userOwes'
	| 'userAutoPicksLeft'
	| 'userAutoPickStrategy'
	| 'userCommunicationsOptedOut'
	| 'yearsPlayed'
> & {
	userReferredByUser: Pick<User, 'userName'> | null;
	notifications: Array<UserNotificationForAdmin>;
	accounts: Array<Pick<Account, 'accountProviderID'>>;
};

type GetAdminUsersResponse = {
	getUsersForAdmins: Array<UserForAdmin>;
};

type GetAdminUsersInput = {
	userType: AdminUserType;
};

const query = gql`
	query GetUsersForAdmin($userType: AdminUserType!) {
		getUsersForAdmins(UserType: $userType) {
			userID
			userEmail
			userName
			userFirstName
			userLastName
			userTeamName
			userReferredByRaw
			userReferredByUser {
				userName
			}
			userEmailVerified
			userTrusted
			userDoneRegistering
			userPlaysSurvivor
			userPaid
			userOwes
			userAutoPicksLeft
			userAutoPickStrategy
			userCommunicationsOptedOut
			notifications {
				notificationID
				notificationEmail
				notificationEmailHoursBefore
				notificationSMS
				notificationSMSHoursBefore
				notificationDefinition {
					notificationTypeDescription
				}
			}
			yearsPlayed
			accounts {
				accountProviderID
			}
		}
	}
`;

export const useAdminUsers = (
	userType: AdminUserType,
): SWRResponse<GetAdminUsersResponse, unknown> =>
	useSWR<GetAdminUsersResponse, GetAdminUsersInput>([query, userType], (query, userType) =>
		fetcher(query, { userType }),
	);

type ToggleSurvivorResponse = {
	toggleSurvivor: boolean;
};

type ToggleSurvivorInput = {
	isPlaying: boolean;
	userID: number;
};

const toggleSurvivorMutation = gql`
	mutation ToggleSurvivor($userID: Int!, $isPlaying: Boolean!) {
		toggleSurvivor(UserID: $userID, IsPlaying: $isPlaying)
	}
`;

export const toggleSurvivor = async (
	userID: number,
	isPlaying: boolean,
): Promise<ToggleSurvivorResponse> =>
	fetcher<ToggleSurvivorResponse, ToggleSurvivorInput>(toggleSurvivorMutation, {
		isPlaying,
		userID,
	});

type RemoveUserResponse = {
	removeUser: boolean;
};

type RemoveUserInput = {
	userID: number;
};

const removeUserMutation = gql`
	mutation RemoveUser($userID: Int!) {
		removeUser(UserID: $userID)
	}
`;

export const removeUser = async (userID: number): Promise<RemoveUserResponse> =>
	fetcher<RemoveUserResponse, RemoveUserInput>(removeUserMutation, {
		userID,
	});

type UpdateUserPaidResponse = {
	updateUserPaid: number;
};

type UpdateUserPaidInput = {
	amountPaid: number;
	userID: number;
};

const updateUserPaidMutation = gql`
	mutation UpdateUserPaid($userID: Int!, $amountPaid: Float!) {
		updateUserPaid(UserID: $userID, AmountPaid: $amountPaid)
	}
`;

export const setUserPaid = async (
	userID: number,
	amountPaid: number,
): Promise<UpdateUserPaidResponse> =>
	fetcher<UpdateUserPaidResponse, UpdateUserPaidInput>(updateUserPaidMutation, {
		amountPaid,
		userID,
	});

type TrustUserResponse = {
	trustUser: number;
};

type TrustUserInput = {
	referredBy: number;
	userID: number;
};

const trustUserMutation = gql`
	mutation TrustUser($userID: Int!, $referredBy: Int!) {
		trustUser(UserID: $userID, ReferredByUserID: $referredBy)
	}
`;

export const trustUser = async (
	userID: number,
	referredBy: number,
): Promise<TrustUserResponse> =>
	fetcher<TrustUserResponse, TrustUserInput>(trustUserMutation, {
		referredBy,
		userID,
	});
