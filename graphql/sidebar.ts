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
import type { Week } from '../generated/graphql';

const getCurrentWeekQuery = `
	query GetCurrentWeek {
		getWeek {
			weekNumber
			seasonStatus
		}
	}
`;

export const useCurrentWeek = () => ({
	data: {
		getWeek: {} as Pick<Week, 'weekNumber' | 'seasonStatus'>,
		getCurrentWeekQuery,
	},
	error: null,
	isValidating: false,
});

const getSelectedWeekQuery = `
	query GetSelectedWeek($week: Int!) {
		getWeek(Week: $week) {
			weekNumber
			weekStarts
			weekStatus
		}
	}
`;

export const useSelectedWeek = (week: number) => ({
	data: {
		getWeek: {} as Pick<Week, 'weekNumber' | 'weekStarts' | 'weekStatus'>,
		getSelectedWeekQuery,
		week,
	},
	error: null,
	isValidating: false,
});

// const registerForSurvivorMutation = `
// 	mutation RegisterUserForSurvivorPool {
// 		registerForSurvivor
// 	}
// `;

export const registerForSurvivor = async (): Promise<boolean> => true;

// const unregisterForSurvivorMutation = `
// 	mutation UnregisterUserForSurvivorPool {
// 		unregisterForSurvivor
// 	}
// `;

export const unregisterForSurvivor = async (): Promise<boolean> => true;
