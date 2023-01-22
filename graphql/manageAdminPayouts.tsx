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
import type { Payment, User } from "../generated/graphql";

export type Winner = Pick<
  User,
  | "userID"
  | "userName"
  | "userTeamName"
  | "userPaymentAccount"
  | "userPaymentType"
  | "userWon"
  | "userPaidOut"
  | "userBalance"
> & {
  payments: Array<Pick<Payment, "paymentType" | "paymentWeek" | "paymentDescription">>;
};

const winnersQuery = `
  query getWinnersForAdmin {
    getUserPaymentsForAdmin {
      userID
      userName
      userTeamName
      userPaymentAccount
      userPaymentType
      userWon
      userPaidOut
      userBalance
      payments {
        paymentType
        paymentWeek
        paymentDescription
      }
    }
  }
`;

export const useWinners = () => ({
  data: {
    getUserPaymentsForAdmin: [] as Array<Winner>,
    winnersQuery,
  },
  error: null,
  isValidating: false,
  mutate: (a?: (c: any) => any, b?: boolean): any => {
    console.log(a, b);
  },
});

type AddUserPayoutResponse = {
  updateUserPayout: number;
};

// const addUserPayoutMutation = `
//   mutation AddUserPayout($userID: Int!, $amount: Float!) {
//     updateUserPayout(UserID: $userID, AmountPaid: $amount)
//   }
// `;

export const insertUserPayout = async (
  _userID: number,
  _amount: number,
): Promise<AddUserPayoutResponse> => ({
  updateUserPayout: 0,
});
