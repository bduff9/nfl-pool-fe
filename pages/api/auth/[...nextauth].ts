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
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import Models from '../../../models';
import {
	HOURS_IN_DAY,
	MINUTES_IN_HOUR,
	SECONDS_IN_MINUTE,
	DAYS_IN_WEEK,
	WEEKS_IN_SEASON,
} from '../../../utils/constants';
import { mxExists, sendLoginEmailViaAPI } from '../../../utils/auth.server';
import { LogAction } from '../../../generated/graphql';
import { TAuthUser, TSessionUser } from '../../../utils/types';
import { log } from '../../../utils/logging';
import { getPaymemtDueWeek, writeLog } from '../../../graphql/[...nextauth]';

const {
	DATABASE_URL,
	GOOGLE_ID,
	GOOGLE_SECRET,
	// JWT_SECRET,
	NEXT_PUBLIC_SITE_URL,
	secret,
	TWITTER_ID,
	TWITTER_SECRET,
} = process.env;

if (!DATABASE_URL) throw new Error('Missing database URL');

if (!GOOGLE_ID) throw new Error('Missing Google ID');

if (!GOOGLE_SECRET) throw new Error('Missing Google secret');

if (!TWITTER_ID) throw new Error('Missing Twitter ID');

if (!TWITTER_SECRET) throw new Error('Missing Twitter secret');

const options: NextAuthOptions = {
	adapter: Adapters.TypeORM.Adapter(
		{
			type: 'mysql',
			url: DATABASE_URL,
		},
		{
			models: { ...Models },
		},
	),
	callbacks: {
		async signIn (user, _account, _profile): Promise<boolean | string> {
			const isBanned = (user as TAuthUser).isTrusted === false;

			if (isBanned) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=NotAllowed`;
			}

			const isValidMX = !!user.email && (await mxExists(user.email));
			const userExists = (user as TAuthUser).doneRegistering;

			log.debug('~~~Signin:', { _account, _profile, user });

			if (!isValidMX) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=InvalidEmail`;
			}

			if (userExists) return true;

			const { getCurrentWeek, getSystemValue } = await getPaymemtDueWeek();

			if (!getSystemValue.systemValueValue) {
				console.error('Missing PaymentDueWeek property:', { getSystemValue });

				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=MissingSystemProperty`;
			}

			const lastRegistrationWeek = parseInt(getSystemValue.systemValueValue, 10);

			if (getCurrentWeek > lastRegistrationWeek) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=RegistrationOver`;
			}

			return true;
		},
		async session (session, user) {
			const {
				doneRegistering,
				email,
				firstName,
				hasSurvivor,
				id,
				isAdmin,
				isNewUser,
				isTrusted,
				lastName,
			} = user as TAuthUser;

			log.debug('~~~session:', { session, user });

			session.user = {
				...session.user,
				doneRegistering,
				email,
				firstName,
				hasSurvivor,
				id,
				isAdmin,
				isNewUser,
				isTrusted,
				lastName,
			} as TSessionUser;

			return session;
		},
	},
	events: {
		async signIn (message): Promise<void> {
			await writeLog(
				LogAction.Login,
				`${message.user.email} signed in`,
				`${message.user.id}`,
			);
		},
		async signOut (message: null | Session): Promise<void> {
			await writeLog(LogAction.Logout, `${message?.email} signed out`, `${message?.id}`);
		},
		async createUser (message): Promise<void> {
			log.debug('~~~~createUser: ', { message });
			await writeLog(
				LogAction.CreatedAccount,
				`${message.email} created an account`,
				`${message.id}`,
			);
		},
		async linkAccount (message): Promise<void> {
			log.debug('~~~linkAccount: ', { message });
			await writeLog(
				LogAction.LinkedAccount,
				`${message.user.email} linked ${message.providerAccount.provider} account`,
				`${message.user.id}`,
			);
		},
		async session (message: { session: Session }, ...rest: unknown[]): Promise<void> {
			log.debug('~~~session: ', { message, rest });
		},
		async error (message): Promise<void> {
			const result = await writeLog(
				LogAction.AuthenticationError,
				`{message.email} had an authentication error`,
				`{message.sub}`,
			);

			//TODO: clean up once tested
			log.debug('~~~error event start~~~', { message, result });
		},
	},
	pages: {
		newUser: '/users/create',
		signIn: '/auth/login',
		signOut: '/auth/logout',
	},
	providers: [
		Providers.Email({
			sendVerificationRequest: sendLoginEmailViaAPI,
		}),
		Providers.Google({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET,
			// profile: async function (...args) {
			// 	log.info({ args });

			// 	return {
			// 		id: '',
			// 	};
			// },
		}),
		Providers.Twitter({
			clientId: TWITTER_ID,
			clientSecret: TWITTER_SECRET,
		}),
	],
	secret,
	session: {
		maxAge:
			(WEEKS_IN_SEASON + 3) *
			DAYS_IN_WEEK *
			HOURS_IN_DAY *
			MINUTES_IN_HOUR *
			SECONDS_IN_MINUTE,
	},
};

// ts-prune-ignore-next
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
	NextAuth(req, res, options);
