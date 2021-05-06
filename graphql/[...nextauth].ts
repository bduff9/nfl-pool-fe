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
import { gql } from 'graphql-request';

import { fetcher } from '../utils/graphql';
import {
	Log,
	LogAction,
	MutationWriteLogArgs,
	QueryGetSystemValueArgs,
	Scalars,
	SystemValue,
} from '../generated/graphql';

type GetPaymentDueWeekResponse = {
	getCurrentWeek: Scalars['Int'];
	getSystemValue: Pick<
		SystemValue,
		'systemValueID' | 'systemValueName' | 'systemValueValue'
	>;
};

const getPaymentDueWeekQuery = gql`
	query GetCurrentWeek($Name: String!) {
		getCurrentWeek
		getSystemValue(Name: $Name) {
			systemValueID
			systemValueName
			systemValueValue
		}
	}
`;

export const getPaymemtDueWeek = async (): Promise<GetPaymentDueWeekResponse> => {
	const vars = { Name: 'PaymentDueWeek' };

	return fetcher<GetPaymentDueWeekResponse, QueryGetSystemValueArgs>(
		getPaymentDueWeekQuery,
		vars,
	);
};

type WriteLogResponse = {
	writeLog: Pick<Log, 'logID'>;
};

const writeLogQuery = gql`
	mutation WriteToLog($data: WriteLogInput!) {
		writeLog(data: $data) {
			logID
		}
	}
`;

export const writeLog = async (
	logAction: LogAction,
	logMessage: string,
	sub: null | string = null,
): Promise<WriteLogResponse> => {
	const args: MutationWriteLogArgs = {
		data: {
			logAction,
			logMessage,
			sub,
		},
	};

	return fetcher<WriteLogResponse, MutationWriteLogArgs>(writeLogQuery, args);
};
