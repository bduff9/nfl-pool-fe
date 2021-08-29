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
import useSWR, { SWRResponse } from 'swr';

import { Log, LogAction, LogResult, User } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetAdminLogsResponse = {
	getLogs: Pick<LogResult, 'totalCount' | 'page' | 'count'> & {
		results: Array<
			Pick<Log, 'logID' | 'logAction' | 'logDate' | 'logMessage' | 'logData'> & {
				user: null | Pick<User, 'userID' | 'userName'>;
			}
		>;
	};
	getLogActions: Array<Array<string>>;
	getUsersForAdmins: Array<Pick<User, 'userID' | 'userFirstName' | 'userLastName'>>;
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
			page
			count
			results {
				logID
				logAction
				logDate
				logMessage
				logData
				user {
					userID
					userName
				}
			}
		}
		getLogActions
		getUsersForAdmins(UserType: All) {
			userID
			userFirstName
			userLastName
		}
	}
`;

export const useAdminLogs = (
	input: GetAdminLogsInput,
): SWRResponse<GetAdminLogsResponse, unknown> =>
	useSWR<GetAdminLogsResponse, GetAdminLogsInput>(
		[
			query,
			input.logAction,
			input.page,
			input.perPage,
			input.sort,
			input.sortDir,
			input.userID,
		],
		(query, logAction, page, perPage, sort, sortDir, userID) =>
			fetcher(query, {
				logAction,
				page,
				perPage,
				sort,
				sortDir,
				userID,
			}),
	);
