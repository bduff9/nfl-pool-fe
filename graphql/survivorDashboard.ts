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
import type { Team } from '../generated/graphql';
import { SeasonStatus } from '../generated/graphql';

const getSurvivorDashboardQuery = `
	query GetSurvivorDashboard($week: Int!) {
		survivorAliveForWeek: getSurvivorWeekCount(Type: Alive)
		survivorDeadForWeek: getSurvivorWeekCount(Type: Dead)
		survivorWaitingForWeek: getSurvivorWeekCount(Type: Waiting)
		getSurvivorWeekCount
		survivorAliveOverall: getSurvivorOverallCount(Type: true)
		survivorDeadOverall: getSurvivorOverallCount(Type: false)
		getSurvivorOverallCount
		getMySurvivorDashboard {
			isAliveOverall
			lastPickTeam {
				teamCity
				teamLogo
				teamName
			}
		}
		getMySurvivorPickForWeek(Week: $week) {
			team {
				teamCity
				teamLogo
				teamName
			}
		}
		getSurvivorStatus
	}
`;

export const useSurvivorDashboard = (week: number) => ({
	data: {
		survivorAliveForWeek: 0,
		survivorDeadForWeek: 0,
		survivorWaitingForWeek: 0,
		getSurvivorWeekCount: 0,
		survivorAliveOverall: 0,
		survivorDeadOverall: 0,
		getSurvivorOverallCount: 0,
		getMySurvivorDashboard: {} as null | {
			isAliveOverall: boolean;
			lastPickTeam: Pick<Team, 'teamCity' | 'teamLogo' | 'teamName'>;
		},
		getMySurvivorPickForWeek: {} as null | {
			team: Pick<Team, 'teamCity' | 'teamLogo' | 'teamName'>;
		},
		getSurvivorStatus: SeasonStatus.InProgress,
		getSurvivorDashboardQuery,
		week,
	},
	error: null,
	isValidating: false,
});

const getSurvivorIsAliveQuery = `
	query SurvivorIsAlive {
		isAliveInSurvivor
	}
`;

export const useSurvivorIsAlive = () => ({
	data: {
		getSurvivorIsAliveQuery,
		isAliveInSurvivor: true,
	},
	error: null,
	isValidating: false,
});
