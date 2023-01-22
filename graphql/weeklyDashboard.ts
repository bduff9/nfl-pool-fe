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
import type { WeeklyMv } from '../generated/graphql';

const query = `
	query WeeklyDashboard($week: Int!) {
		getMyWeeklyDashboard(Week: $week) {
			rank
			tied
			pointsEarned
			pointsWrong
			pointsPossible
			pointsTotal
			gamesCorrect
			gamesWrong
			gamesPossible
			gamesTotal
			tiebreakerScore
			lastScore
		}
	}
`;

export const useWeeklyDashboard = (week: number) => ({
	data: {
		getMyWeeklyDashboard: {} as null | Pick<
			WeeklyMv,
			| 'rank'
			| 'tied'
			| 'pointsEarned'
			| 'pointsWrong'
			| 'pointsPossible'
			| 'pointsTotal'
			| 'gamesCorrect'
			| 'gamesWrong'
			| 'gamesPossible'
			| 'gamesTotal'
			| 'tiebreakerScore'
			| 'lastScore'
		>,
		query,
		week,
	},
	error: null,
	isValidating: false,
});

const getWeeklyCountsQuery = `
	query GetWeeklyCounts($week: Int!) {
		getWeeklyTiedWithMeCount(Week: $week)
		getWeeklyRankingsTotalCount(Week: $week)
	}
`;

export const useWeeklyCounts = (selectedWeek: number) => ({
	data: {
		getWeeklyRankingsTotalCount: 0,
		getWeeklyTiedWithMeCount: 0,
		getWeeklyCountsQuery,
		selectedWeek,
	},
	error: null,
	isValidating: false,
});
