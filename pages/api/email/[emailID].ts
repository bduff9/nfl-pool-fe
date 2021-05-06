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
