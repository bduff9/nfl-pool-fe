import type { NextApiRequest, NextApiResponse } from 'next';

import { getEmail } from '../../../graphql/[emailID]';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const { emailID } = req.query;

	try {
		const {
			getEmail: { html },
		} = await getEmail(emailID);

		res.status(200).send(html);
	} catch (error) {
		console.error('Error retrieving email:', error);
		res.status(404).send('<h1>Email not found, please try again later</h1>');
	}
};

// ts-prune-ignore-next
export default handler;
