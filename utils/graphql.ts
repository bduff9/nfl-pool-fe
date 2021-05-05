import { GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/client';

import { NEXT_PUBLIC_API_URL } from './constants';

const gqlURL = `${NEXT_PUBLIC_API_URL}/api/graphql`;

if (!gqlURL) throw new Error('Missing GraphQL API URL!');

const client = new GraphQLClient(gqlURL, {
	credentials: 'include',
	mode: 'cors',
});

export const fetcher = async <ReturnType, Vars extends Record<string, any> = never>(
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
