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
import type {
  Account,
  AdminUserType,
  Notification,
  NotificationType,
  User,
} from "../generated/graphql";

export type UserNotificationForAdmin = Pick<
  Notification,
  | "notificationID"
  | "notificationEmail"
  | "notificationEmailHoursBefore"
  | "notificationSMS"
  | "notificationSMSHoursBefore"
> & {
  notificationDefinition: Pick<NotificationType, "notificationTypeDescription">;
};

export type UserForAdmin = Pick<
  User,
  | "userID"
  | "userEmail"
  | "userName"
  | "userFirstName"
  | "userLastName"
  | "userTeamName"
  | "userReferredByRaw"
  | "userEmailVerified"
  | "userTrusted"
  | "userDoneRegistering"
  | "userPlaysSurvivor"
  | "userPaid"
  | "userOwes"
  | "userAutoPicksLeft"
  | "userAutoPickStrategy"
  | "userCommunicationsOptedOut"
  | "yearsPlayed"
> & {
  userReferredByUser: Pick<User, "userName"> | null;
  notifications: Array<UserNotificationForAdmin>;
  accounts: Array<Pick<Account, "accountProviderID">>;
};

const query = `
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

export const useAdminUsers = (userType: AdminUserType) => ({
  data: {
    getUsersForAdmins: [] as Array<UserForAdmin>,
    query,
    userType,
  },
  error: null,
  isValidating: false,
  mutate: (a?: (c: any) => any, b?: boolean): any => {
    console.log(a, b);
  },
});

type ToggleSurvivorResponse = {
  toggleSurvivor: boolean;
};

// const toggleSurvivorMutation = `
//   mutation ToggleSurvivor($userID: Int!, $isPlaying: Boolean!) {
//     toggleSurvivor(UserID: $userID, IsPlaying: $isPlaying)
//   }
// `;

export const toggleSurvivor = async (
  _userID: number,
  _isPlaying: boolean,
): Promise<ToggleSurvivorResponse> => ({
  toggleSurvivor: true,
});

type RemoveUserResponse = {
  removeUser: boolean;
};

// const removeUserMutation = `
//   mutation RemoveUser($userID: Int!) {
//     removeUser(UserID: $userID)
//   }
// `;

export const removeUser = async (_userID: number): Promise<RemoveUserResponse> => ({
  removeUser: true,
});

type UpdateUserPaidResponse = {
  updateUserPaid: number;
};

// const updateUserPaidMutation = `
//   mutation UpdateUserPaid($userID: Int!, $amountPaid: Float!) {
//     updateUserPaid(UserID: $userID, AmountPaid: $amountPaid)
//   }
// `;

export const setUserPaid = async (
  _userID: number,
  _amountPaid: number,
): Promise<UpdateUserPaidResponse> => ({
  updateUserPaid: 0,
});

type TrustUserResponse = {
  trustUser: number;
};

// const trustUserMutation = `
//   mutation TrustUser($userID: Int!, $referredBy: Int!) {
//     trustUser(UserID: $userID, ReferredByUserID: $referredBy)
//   }
// `;

export const trustUser = async (
  _userID: number,
  _referredBy: number,
): Promise<TrustUserResponse> => ({
  trustUser: 0,
});
