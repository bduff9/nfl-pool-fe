import { gql } from 'graphql-request';

import { fetcher } from '../utils/graphql';
import { Email, QueryGetEmailArgs } from '../generated/graphql';

type GetEmailResponse = {
	getEmail: Pick<Email, 'emailID' | 'html'>;
};

const query = gql`
	query GetEmail($EmailID: String!) {
		getEmail(EmailID: $EmailID) {
			emailID
			html
		}
	}
`;

export const getEmail = async (emailID: string | string[]): Promise<GetEmailResponse> => {
	const vars: QueryGetEmailArgs = {
		EmailID: typeof emailID === 'string' ? emailID : emailID[0],
	};

	return await fetcher<
		{
			getEmail: {
				emailID: string;
				html: null | string;
			};
		},
		QueryGetEmailArgs
	>(query, vars);
};
