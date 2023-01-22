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
import type { ApiCall, ApiCallResult } from "../generated/graphql";

export type APICallObject = Pick<
  ApiCall,
  | "apiCallID"
  | "apiCallDate"
  | "apiCallResponse"
  | "apiCallUrl"
  | "apiCallWeek"
  | "apiCallYear"
>;

type LoadAdminAPICallsResponse = {
  loadAPICalls: Pick<ApiCallResult, "hasMore" | "lastKey"> & {
    results: Array<APICallObject>;
  };
};

// const query = `
//   query LoadAPICalls($count: Int!, $lastKey: String) {
//     loadAPICalls(Count: $count, LastKey: $lastKey) {
//       hasMore
//       lastKey
//       results {
//         apiCallID
//         apiCallDate
//         apiCallResponse
//         apiCallUrl
//         apiCallWeek
//         apiCallYear
//       }
//     }
//   }
// `;

export const loadAPICalls = async (
  _count: number,
  _lastKey: null | string,
): Promise<LoadAdminAPICallsResponse> => ({
  loadAPICalls: {} as Pick<ApiCallResult, "hasMore" | "lastKey"> & {
    results: Array<APICallObject>;
  },
});
