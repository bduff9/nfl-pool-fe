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
import { ClientError, gql } from 'graphql-request';
import useSWR from 'swr';
import type { Fetcher } from 'swr';

import { Log, LogAction, LogResult, User } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetAdminLogsResponse = {
	getLogs: Pick<LogResult, 'totalCount'> & {
		results: Array<
			Pick<Log, 'logID' | 'logAction' | 'logDate' | 'logMessage' | 'logData'> & {
				user: null | Pick<User, 'userName'>;
			}
		>;
	};
};

type GetAdminLogsInput = {
	logAction?: LogAction | null;
	page?: number;
	perPage: number;
	sort: 'logID';
	sortDir: 'ASC' | 'DESC';
	userID?: null | number;
};

const query = gql`
	query ViewLogs(
		$logAction: LogAction
		$page: Int
		$perPage: Int!
		$sort: String!
		$sortDir: String!
		$userID: Int
	) {
		getLogs(
			LogAction: $logAction
			Page: $page
			PerPage: $perPage
			Sort: $sort
			SortDir: $sortDir
			UserID: $userID
		) {
			totalCount
			results {
				logID
				logAction
				logDate
				logMessage
				logData
				user {
					userName
				}
			}
		}
	}
`;

const adminLogsFetcher: Fetcher<
	GetAdminLogsResponse,
	[string, LogAction, number, number, 'logID', 'ASC' | 'DESC', number]
> = ([query, logAction, page, perPage, sort, sortDir, userID]) =>
	fetcher(query, {
		logAction,
		page,
		perPage,
		sort,
		sortDir,
		userID,
	});

export const useAdminLogs = (input: GetAdminLogsInput) =>
	useSWR<GetAdminLogsResponse, ClientError>(
		[
			query,
			input.logAction,
			input.page,
			input.perPage,
			input.sort,
			input.sortDir,
			input.userID,
		],
		adminLogsFetcher,
	);
