import { GraphQLClient } from 'graphql-request';

import { NEXT_PUBLIC_API_URL } from './constants';

const gqlURL = `${NEXT_PUBLIC_API_URL}/api/graphql`;

if (!gqlURL) throw new Error('Missing GraphQL API URL!');

const client = new GraphQLClient(gqlURL, {
	credentials: 'include',
	mode: 'cors',
});

export const fetcher = <ReturnType, Vars extends Record<string, any> = never>(
	query: string,
	variables?: Vars,
): Promise<ReturnType> => client.request(query, variables);
