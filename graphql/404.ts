import { gql } from 'graphql-request';

import { Log, LogAction, MutationWriteLogArgs } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type WriteLogResponse = { writeLog: Pick<Log, 'logID'> };

const query = gql`
	mutation WriteToLog($data: WriteLogInput!) {
		writeLog(data: $data) {
			logID
		}
	}
`;

export const write404Log = async (
	userID: null | number,
	path: string,
): Promise<WriteLogResponse> => {
	const args: MutationWriteLogArgs = {
		data: {
			logAction: LogAction.Error404,
			logMessage: path,
			sub: userID ? `${userID}` : null,
		},
	};

	return fetcher<WriteLogResponse, MutationWriteLogArgs>(query, args);
};
