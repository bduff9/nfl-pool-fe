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
	AutoPickStrategy,
	Pick as PoolPick,
	Tiebreaker,
} from '../generated/graphql';

const query = `
	query GetMyTiebreakerForWeek($week: Int!) {
		getMyTiebreakerForWeek(Week: $week) {
			tiebreakerLastScore
			tiebreakerHasSubmitted
		}
	}
`;

export const useMyTiebreakerForWeek = (week: number) => ({
	data: {
		getMyTiebreakerForWeek: {} as null | Pick<
			Tiebreaker,
			'tiebreakerLastScore' | 'tiebreakerHasSubmitted'
		>,
		query,
		week,
	},
	error: null,
	isValidating: false,
	mutate: (a?: (c: any) => any, b?: boolean): any => {
		console.log(a, b);
	},
});

type ResetPicksMutationResult = {
	resetMyPicksForWeek: Pick<PoolPick, 'pickID'>;
};

// const resetMyPicksMutation = `
// 	mutation ResetMyPicksForWeek($week: Int!) {
// 		resetMyPicksForWeek(Week: $week) {
// 			pickID
// 		}
// 	}
// `;

export const resetMyPicksForWeek = async (
	_week: number,
): Promise<ResetPicksMutationResult> => ({
	resetMyPicksForWeek: {} as Pick<PoolPick, 'pickID'>,
});

type SetMyPickMutationResult = {
	setMyPick: Pick<PoolPick, 'pickID'>;
};

// const setMyPickMutation = `
// 	mutation SetMyPick($week: Int!, $gameID: Int, $teamID: Int, $points: Int!) {
// 		setMyPick(Week: $week, GameID: $gameID, TeamID: $teamID, Points: $points) {
// 			pickID
// 		}
// 	}
// `;

export const setMyPick = async (
	_week: number,
	_gameID: null | number,
	_teamID: null | number,
	_points: number,
): Promise<SetMyPickMutationResult> => ({
	setMyPick: {} as Pick<PoolPick, 'pickID'>,
});

type UpdateMyTiebreakerScoreMutationResult = {
	updateMyTiebreakerScore: Pick<Tiebreaker, 'tiebreakerLastScore'>;
};

// const updateMyTiebreakerScoreMutation = `
// 	mutation UpdateMyTiebreakerScore($week: Int!, $score: Int!) {
// 		updateMyTiebreakerScore(Week: $week, Score: $score) {
// 			tiebreakerLastScore
// 		}
// 	}
// `;

export const updateMyTiebreakerScore = async (
	_week: number,
	_score: number,
): Promise<UpdateMyTiebreakerScoreMutationResult> => ({
	updateMyTiebreakerScore: {} as Pick<Tiebreaker, 'tiebreakerLastScore'>,
});

type AutoPickMutationResult = {
	autoPick: Pick<PoolPick, 'pickID'>;
};

// const autoPickMutation = `
// 	mutation AutoPick($week: Int!, $type: AutoPickStrategy!) {
// 		autoPick(Week: $week, Type: $type) {
// 			pickID
// 		}
// 	}
// `;

export const autoPickMyPicks = async (
	_week: number,
	_type: AutoPickStrategy,
): Promise<AutoPickMutationResult> => ({
	autoPick: {} as Pick<PoolPick, 'pickID'>,
});

type ValidateMyPicksQueryResult = {
	validatePicksForWeek: boolean;
};

// const validateMyPicksQuery = `
// 	query ValidatePicks($week: Int!, $unused: String!, $lastScore: Int!) {
// 		validatePicksForWeek(Week: $week, Unused: $unused, LastScore: $lastScore)
// 	}
// `;

export const validateMyPicks = async (
	_week: number,
	_unused: Array<number>,
	_lastScore: number,
): Promise<ValidateMyPicksQueryResult> => ({
	validatePicksForWeek: true,
});

type SubmitMyPicksMutationResult = {
	submitPicksForWeek: Pick<Tiebreaker, 'tiebreakerHasSubmitted'>;
};

// const submitMyPicksMutation = `
// 	mutation SubmitPicks($week: Int!) {
// 		submitPicksForWeek(Week: $week) {
// 			tiebreakerHasSubmitted
// 		}
// 	}
// `;

export const submitMyPicks = async (
	_week: number,
): Promise<SubmitMyPicksMutationResult> => ({
	submitPicksForWeek: {} as Pick<Tiebreaker, 'tiebreakerHasSubmitted'>,
});
