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
import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ENV } from './constants';

const apiKey = process.env.LOGFLARE_API_KEY;
const sourceToken = process.env.LOGFLARE_SOURCE_TOKEN;
const sendToLogflare = !!apiKey && !!sourceToken;
let pinoLogger: pino.Logger;

if (sendToLogflare) {
	const { stream, send } = logflarePinoVercel({
		apiBaseUrl: NEXT_PUBLIC_API_URL,
		apiKey,
		sourceToken,
		transforms: {
			numbersToFloats: true,
		},
	});

	pinoLogger = pino(
		{
			base: {
				env: NEXT_PUBLIC_ENV,
				revision: process.env.VERCEL_GITHUB_COMMIT_SHA ?? '',
			},
			browser: {
				transmit: {
					level: 'debug',
					send,
				},
			},
			level: 'debug',
		},
		stream,
	);
} else {
	pinoLogger = pino({
		base: {
			env: NEXT_PUBLIC_ENV,
			revision: process.env.VERCEL_GITHUB_COMMIT_SHA ?? '',
		},
		level: 'debug',
		prettyPrint: true,
	});
}

export const logger = pinoLogger;
