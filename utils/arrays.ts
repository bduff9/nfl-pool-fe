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
import { GameForWeek } from '../graphql/scoreboard';
import { ViewAllPick } from '../graphql/viewAll';
import { WeeklyRank } from '../graphql/weekly';

export const getEmptyArray = (length: number): Array<unknown> => {
	return [...Array(length)];
};

const weekPlacer = (user1: WeeklyRank, user2: WeeklyRank): -1 | 0 | 1 => {
	// First, sort by points
	if (user1.pointsEarned > user2.pointsEarned) return -1;

	if (user1.pointsEarned < user2.pointsEarned) return 1;

	// Then, sort by games correct
	if (user1.gamesCorrect > user2.gamesCorrect) return -1;

	if (user1.gamesCorrect < user2.gamesCorrect) return 1;

	// Stop here if last game hasn't been played
	if (typeof user1.lastScore !== 'number' || typeof user2.lastScore !== 'number') return 0;

	// Otherwise, sort by whomever didn't go over the last game's score
	const lastScoreDiff1 = user1.lastScore - (user1.tiebreakerScore ?? 0);
	const lastScoreDiff2 = user2.lastScore - (user2.tiebreakerScore ?? 0);

	if (lastScoreDiff1 >= 0 && lastScoreDiff2 < 0) return -1;

	if (lastScoreDiff1 < 0 && lastScoreDiff2 >= 0) return 1;

	// Next, sort by the closer to the last games score
	if (Math.abs(lastScoreDiff1) < Math.abs(lastScoreDiff2)) return -1;

	if (Math.abs(lastScoreDiff1) > Math.abs(lastScoreDiff2)) return 1;

	// Finally, if we get here, then they are identical
	return 0;
};

export const sortPicks = (
	picks: Array<ViewAllPick> | undefined,
	games: Record<number, GameForWeek>,
	ranks: Array<WeeklyRank> | undefined,
): Array<WeeklyRank> | undefined => {
	if (!picks || !ranks) return undefined;

	const customRanks = ranks.map(rank => ({
		...rank,
		rank: 0,
		tied: false,
		pointsEarned: 0,
		gamesCorrect: 0,
	}));

	for (const user of customRanks) {
		const [pointsEarned, gamesCorrect] = picks.reduce(
			(acc, pick) => {
				if (pick.user.userID !== user.userID) return acc;

				const game = games[pick.game.gameID];

				if (!game) return acc;

				if (!pick.team || !game.winnerTeam) return acc;

				if (pick.team.teamID === game.winnerTeam.teamID) {
					acc[0] += pick.pickPoints ?? 0;
					acc[1]++;
				}

				return acc;
			},
			[0, 0],
		);

		user.pointsEarned = pointsEarned;
		user.gamesCorrect = gamesCorrect;
	}

	customRanks.sort(weekPlacer);

	customRanks.forEach((user, i, allUsers) => {
		let currPlace = i + 1;
		let result;

		if (!user.tied || i === 0) {
			user.rank = currPlace;
		} else {
			currPlace = user.rank ?? 0;
		}

		const nextUser = allUsers[i + 1];

		if (nextUser) {
			result = weekPlacer(user, nextUser);

			if (result === 0) {
				user.tied = true;
				nextUser.rank = currPlace;
				nextUser.tied = true;
			} else {
				if (i === 0) user.tied = false;

				nextUser.tied = false;
			}
		}
	});

	return customRanks;
};
