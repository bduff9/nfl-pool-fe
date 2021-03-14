import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';

import { fetcher } from '../../../utils/graphql';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => {
	const { emailID } = req.query;
	const query = gql`
		query GetEmail($emailID: String!) {
			getEmail(EmailID: $emailID) {
				emailID
				html
			}
		}
	`;

	try {
		const data = await fetcher<{
			getEmail: {
				emailID: string;
				html: null | string;
			};
		}>(query, { emailID });

		res.status(200).send(data.getEmail.html);
	} catch (error) {
		res.status(404).send('<h1>Email not found, please try again later</h1>');
	}
};

// ts-prune-ignore-next
export default handler;
