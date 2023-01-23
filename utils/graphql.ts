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
import { GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/client';

import { NEXT_PUBLIC_API_URL } from './constants';

if (!NEXT_PUBLIC_API_URL) throw new Error('Missing GraphQL API URL!');

const client = new GraphQLClient(`${NEXT_PUBLIC_API_URL}/api/graphql`, {
	credentials: 'include',
	mode: 'cors',
});

export const fetcher = async <ReturnType, Vars extends Record<string, unknown> = never>(
	query: string,
	variables?: Vars,
): Promise<ReturnType> => {
	const session = await getSession({});
	const headers: HeadersInit = {};

	if (session) {
		headers.authorization = `Bearer ${session.accessToken}`;
	}

	return client.request(query, variables, headers);
};
