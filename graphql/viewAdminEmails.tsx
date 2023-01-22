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
import type { Email, EmailResult, User } from "../generated/graphql";

export type EmailResponse = Pick<
  Email,
  "emailID" | "emailType" | "to" | "subject" | "html" | "sms" | "createdAt"
> & {
  toUsers: Array<
    Pick<User, "userID" | "userEmail" | "userPhone" | "userFirstName" | "userLastName">
  >;
};

type LoadAdminEmailsResponse = {
  loadEmails: Pick<EmailResult, "hasMore" | "lastKey"> & {
    results: Array<EmailResponse>;
  };
};

// const query = `
//   query LoadEmails($count: Int!, $lastKey: String) {
//     loadEmails(Count: $count, LastKey: $lastKey) {
//       hasMore
//       lastKey
//       results {
//         emailID
//         emailType
//         to
//         toUsers {
//           userID
//           userEmail
//           userPhone
//           userFirstName
//           userLastName
//         }
//         subject
//         html
//         sms
//         createdAt
//       }
//     }
//   }
// `;

export const loadEmails = async (
  _count: number,
  _lastKey: null | string,
): Promise<LoadAdminEmailsResponse> => ({
  loadEmails: {} as Pick<EmailResult, "hasMore" | "lastKey"> & {
    results: Array<EmailResponse>;
  },
});
