/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
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
import { ClientError, gql } from 'graphql-request';
import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';

import { AutoPickStrategy, Pick as PoolPick, Tiebreaker } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetMyTiebreakerForWeekResponse = {
	getMyTiebreakerForWeek: null | Pick<
		Tiebreaker,
		'tiebreakerLastScore' | 'tiebreakerHasSubmitted'
	>;
};

const query = gql`
	query GetMyTiebreakerForWeek($week: Int!) {
		getMyTiebreakerForWeek(Week: $week) {
			tiebreakerLastScore
			tiebreakerHasSubmitted
		}
	}
`;

export const useMyTiebreakerForWeek = (
	week: number,
): SWRResponse<GetMyTiebreakerForWeekResponse, ClientError> =>
	useSWR<GetMyTiebreakerForWeekResponse, ClientError>(
		[query, week],
		(): Promise<GetMyTiebreakerForWeekResponse> => fetcher(query, { week }),
	);

type ResetPicksMutationResult = {
	resetMyPicksForWeek: Pick<PoolPick, 'pickID'>;
};

type ResetPicksMutationInput = {
	week: number;
};

const resetMyPicksMutation = gql`
	mutation ResetMyPicksForWeek($week: Int!) {
		resetMyPicksForWeek(Week: $week) {
			pickID
		}
	}
`;

export const resetMyPicksForWeek = async (
	week: number,
): Promise<ResetPicksMutationResult> =>
	fetcher<ResetPicksMutationResult, ResetPicksMutationInput>(resetMyPicksMutation, {
		week,
	});

type SetMyPickMutationResult = {
	setMyPick: Pick<PoolPick, 'pickID'>;
};

type SetMyPickMutationInput = {
	week: number;
	gameID: null | number;
	teamID: null | number;
	points: number;
};

const setMyPickMutation = gql`
	mutation SetMyPick($week: Int!, $gameID: Int, $teamID: Int, $points: Int!) {
		setMyPick(Week: $week, GameID: $gameID, TeamID: $teamID, Points: $points) {
			pickID
		}
	}
`;

export const setMyPick = async (
	week: number,
	gameID: null | number,
	teamID: null | number,
	points: number,
): Promise<SetMyPickMutationResult> =>
	fetcher<SetMyPickMutationResult, SetMyPickMutationInput>(setMyPickMutation, {
		week,
		gameID,
		teamID,
		points,
	});

type UpdateMyTiebreakerScoreMutationResult = {
	updateMyTiebreakerScore: Pick<Tiebreaker, 'tiebreakerLastScore'>;
};

type UpdateMyTiebreakerScoreMutationInput = {
	week: number;
	score: number;
};

const updateMyTiebreakerScoreMutation = gql`
	mutation UpdateMyTiebreakerScore($week: Int!, $score: Int!) {
		updateMyTiebreakerScore(Week: $week, Score: $score) {
			tiebreakerLastScore
		}
	}
`;

export const updateMyTiebreakerScore = async (
	week: number,
	score: number,
): Promise<UpdateMyTiebreakerScoreMutationResult> =>
	fetcher<UpdateMyTiebreakerScoreMutationResult, UpdateMyTiebreakerScoreMutationInput>(
		updateMyTiebreakerScoreMutation,
		{
			week,
			score,
		},
	);

type AutoPickMutationResult = {
	autoPick: Pick<PoolPick, 'pickID'>;
};

type AutoPickMutationInput = {
	week: number;
	type: AutoPickStrategy;
};

const autoPickMutation = gql`
	mutation AutoPick($week: Int!, $type: AutoPickStrategy!) {
		autoPick(Week: $week, Type: $type) {
			pickID
		}
	}
`;

export const autoPickMyPicks = async (
	week: number,
	type: AutoPickStrategy,
): Promise<AutoPickMutationResult> =>
	fetcher<AutoPickMutationResult, AutoPickMutationInput>(autoPickMutation, {
		week,
		type,
	});

type ValidateMyPicksQueryResult = {
	validatePicksForWeek: boolean;
};

type ValidateMyPicksQueryInput = {
	week: number;
	unused: string;
	lastScore: number;
};

const validateMyPicksQuery = gql`
	query ValidatePicks($week: Int!, $unused: String!, $lastScore: Int!) {
		validatePicksForWeek(Week: $week, Unused: $unused, LastScore: $lastScore)
	}
`;

export const validateMyPicks = async (
	week: number,
	unused: Array<number>,
	lastScore: number,
): Promise<ValidateMyPicksQueryResult> =>
	fetcher<ValidateMyPicksQueryResult, ValidateMyPicksQueryInput>(validateMyPicksQuery, {
		week,
		unused: JSON.stringify(unused),
		lastScore,
	});

type SubmitMyPicksMutationResult = {
	submitPicksForWeek: Pick<Tiebreaker, 'tiebreakerHasSubmitted'>;
};

type SubmitMyPicksMutationInput = {
	week: number;
};

const submitMyPicksMutation = gql`
	mutation SubmitPicks($week: Int!) {
		submitPicksForWeek(Week: $week) {
			tiebreakerHasSubmitted
		}
	}
`;

export const submitMyPicks = async (week: number): Promise<SubmitMyPicksMutationResult> =>
	fetcher<SubmitMyPicksMutationResult, SubmitMyPicksMutationInput>(submitMyPicksMutation, {
		week,
	});
