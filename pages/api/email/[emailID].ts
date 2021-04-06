import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';

import { QueryGetEmailArgs } from '../../../generated/graphql';
import { fetcher } from '../../../utils/graphql';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => {
	const { emailID } = req.query;

	const query = gql`
		query GetEmail($EmailID: String!) {
			getEmail(EmailID: $EmailID) {
				emailID
				html
			}
		}
	`;

	try {
		const data = await fetcher<
			{
				getEmail: {
					emailID: string;
					html: null | string;
				};
			},
			QueryGetEmailArgs
		>(query, { EmailID: typeof emailID === 'string' ? emailID : emailID[0] });

		res.status(200).send(data.getEmail.html);
	} catch (error) {
		console.error('Error retrieving email:', error);
		res.status(404).send('<h1>Email not found, please try again later</h1>');
	}
};

// ts-prune-ignore-next
export default handler;
