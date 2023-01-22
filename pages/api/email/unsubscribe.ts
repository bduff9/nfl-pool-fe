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
// import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { unsubscribe } from '../../../graphql/unsubscribe';
import { logger } from '../../../utils/logging';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const { body, method, query } = req;
	let email: string | Array<string> = '';

	if (method === 'POST') {
		try {
			email = body.email;

			if (Array.isArray(email)) {
				email = email[0];
			}

			const isSuccessful = await unsubscribe(email);

			if (isSuccessful) {
				res.status(200).send('You have been successfully unsubscribed');
			} else {
				res.status(500).send('Please contact an admin to finish unsubscribing');
			}
		} catch (error) {
			logger.error({ text: 'Error unsubscribing:', email, error });
			res.status(404).send('<h1>Error unsubscribing, please try again later</h1>');
		}

		return;
	}

	email = query.email ?? '';

	const html = `
<!doctype html>
<html>
	<head lang="en">
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>Unsubscribe - ASWNN</title>
	</head>
	<body>
		<form action="/api/email/unsubscribe" autocomplete="on" method="POST">
			<input autocomplete="email" name="email" type="email" value="${email}" />
			<button type="submit">Unsubscribe</button>
		</form>
	</body>
</html>`;

	res.status(200).send(html);
};

// ts-prune-ignore-next
export default //withSentry(
handler; //);
