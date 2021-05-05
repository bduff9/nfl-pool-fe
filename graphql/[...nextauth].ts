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
