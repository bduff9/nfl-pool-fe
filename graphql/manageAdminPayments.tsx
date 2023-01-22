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
import type { SystemValue } from "../generated/graphql";

const payoutAmountsQuery = `
  query GetPrizesForAdmin {
    weeklyPrizes: getSystemValue(Name: "WeeklyPrizes") {
      systemValueValue
    }
    overallPrizes: getSystemValue(Name: "OverallPrizes") {
      systemValueValue
    }
    survivorPrizes: getSystemValue(Name: "SurvivorPrizes") {
      systemValueValue
    }
    poolCost: getSystemValue(Name: "PoolCost") {
      systemValueValue
    }
    survivorCost: getSystemValue(Name: "SurvivorCost") {
      systemValueValue
    }
    getRegisteredCount
    getSurvivorCount
  }
`;

export const usePayoutAmounts = () => ({
  data: {
    weeklyPrizes: {} as Pick<SystemValue, "systemValueValue"> | null,
    overallPrizes: {} as Pick<SystemValue, "systemValueValue"> | null,
    survivorPrizes: {} as Pick<SystemValue, "systemValueValue"> | null,
    poolCost: {} as Pick<SystemValue, "systemValueValue"> | null,
    survivorCost: {} as Pick<SystemValue, "systemValueValue"> | null,
    getRegisteredCount: 0,
    getSurvivorCount: 0,
    payoutAmountsQuery,
  },
  error: null,
  isValidating: false,
  mutate: (a?: (c: any) => any, b?: boolean): any => {
    console.log(a, b);
  },
});

type SetPrizeAmountsResponse = {
  setPrizeAmounts: boolean;
};

// const setPrizeAmountsMutation = `
//   mutation SetPrizeAmounts(
//     $weeklyPrizes: String!
//     $overallPrizes: String!
//     $survivorPrizes: String!
//   ) {
//     setPrizeAmounts(
//       WeeklyPrizes: $weeklyPrizes
//       OverallPrizes: $overallPrizes
//       SurvivorPrizes: $survivorPrizes
//     )
//   }
// `;

export const setPrizeAmounts = async (
  _weeklyPrizes: string,
  _overallPrizes: string,
  _survivorPrizes: string,
): Promise<SetPrizeAmountsResponse> => ({
  setPrizeAmounts: false,
});
