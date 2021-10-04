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
import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/order
import { getEmail } from '../../../graphql/[emailID]';
import {
	DAYS_IN_MONTH,
	HOURS_IN_DAY,
	MINUTES_IN_HOUR,
	SECONDS_IN_MINUTE,
} from '../../../utils/constants';
import { logger } from '../../../utils/logging';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const { emailID } = req.query;
	const cacheMaxAge =
		6 * DAYS_IN_MONTH * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE; // 6 months

	res.setHeader('Cache-Control', `max-age=${cacheMaxAge}, s-maxage=${cacheMaxAge}`);

	try {
		const {
			getEmail: { html },
		} = await getEmail(emailID);

		res.status(200).send(html);
	} catch (error) {
		logger.error({ text: 'Error retrieving email:', error });
		res.status(404).send('<h1>Email not found, please try again later</h1>');
	}
};

// ts-prune-ignore-next
export default withSentry(handler);
