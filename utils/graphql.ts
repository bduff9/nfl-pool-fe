import { GraphQLClient } from 'graphql-request';

import { NEXT_PUBLIC_API_URL } from './constants';

const gqlURL = `${NEXT_PUBLIC_API_URL}/api/graphql`;

if (!gqlURL) throw new Error('Missing GraphQL API URL!');

const client = new GraphQLClient(gqlURL, {
	credentials: 'include',
});

export const fetcher = <T>(
	query: string,
	variables?: Record<string, any>,
): Promise<T> => client.request(query, variables);
