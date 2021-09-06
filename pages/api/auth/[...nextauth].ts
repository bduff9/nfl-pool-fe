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
import mysql from 'mysql2';
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
import { logger } from '../../../utils/logging';
import { writeLog } from '../../../graphql/[...nextauth]';
import { getAll, getConnection, getOne } from '../../../utils/db';

const {
	DATABASE_URL,
	GOOGLE_ID,
	GOOGLE_SECRET,
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
		async signIn (user, _account, profile): Promise<boolean | string> {
			logger.debug({ text: '~~~Signin:', _account, profile, user });

			const isBanned = (user as TAuthUser).isTrusted === false;

			if (isBanned) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=NotAllowed`;
			}

			const isValidMX = !!user.email && (await mxExists(user.email));
			const userExists = (user as TAuthUser).doneRegistering;

			if (!isValidMX) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=InvalidEmail`;
			}

			if (userExists) return true;

			let connection: mysql.Connection | null = null;

			try {
				connection = getConnection();

				const userPromise = getOne<
					| {
							UserID: number;
							UserName: null | string;
							UserFirstName: null | string;
							UserLastName: null | string;
							UserImage: null | string;
							UserDoneRegistering: boolean;
					  }
					| undefined,
					[string]
				>(connection, 'SELECT * FROM Users WHERE UserEmail = ? AND UserDeleted IS NULL', [
					user.email || '',
				]);
				const paymentDueWeekPromise = getOne<{ SystemValueValue: string }, [string]>(
					connection,
					'SELECT SystemValueValue FROM SystemValues WHERE SystemValueName = ? AND SystemValueDeleted IS NULL',
					['PaymentDueWeek'],
				);
				const currentWeekPromise = getOne<{ GameWeek: number }, [string]>(
					connection,
					`SELECT COALESCE(MIN(GameWeek), ${WEEKS_IN_SEASON}) AS GameWeek FROM Games WHERE GameStatus <> ? AND GameDeleted IS NULL`,
					['Final'],
				);

				const [userResult, paymentDueWeek, currentWeek] = await Promise.all([
					userPromise,
					paymentDueWeekPromise,
					currentWeekPromise,
				]);

				if (userResult) {
					if (!userResult.UserName) {
						if (profile.name) {
							await getAll<Record<string, unknown>, [string, number]>(
								connection,
								'UPDATE Users SET UserName = ? WHERE UserID = ?',
								[profile.name, userResult.UserID],
							);
						} else if (
							(userResult.UserFirstName || profile.given_name) &&
							(userResult.UserLastName || profile.family_name)
						) {
							await getAll<Record<string, unknown>, [string, number]>(
								connection,
								'UPDATE Users SET UserName = ? WHERE UserID = ?',
								[
									`${userResult.UserFirstName || profile.given_name} ${
										userResult.UserLastName || profile.family_name
									}`,
									userResult.UserID,
								],
							);
						}
					}

					if (!userResult.UserFirstName && profile.given_name) {
						await getAll<Record<string, unknown>, [string, number]>(
							connection,
							'UPDATE Users SET UserFirstName = ? WHERE UserID = ?',
							[profile.given_name as string, userResult.UserID],
						);
					}

					if (!userResult.UserLastName && profile.family_name) {
						await getAll<Record<string, unknown>, [string, number]>(
							connection,
							'UPDATE Users SET UserLastName = ? WHERE UserID = ?',
							[profile.family_name as string, userResult.UserID],
						);
					}

					if (
						!userResult.UserImage &&
						(profile.picture || profile.profile_image_url_https)
					) {
						await getAll<Record<string, unknown>, [string, number]>(
							connection,
							'UPDATE Users SET UserImage = ? WHERE UserID = ?',
							[
								(profile.picture || profile.profile_image_url_https) as string,
								userResult.UserID,
							],
						);
					}

					if (userResult.UserDoneRegistering) {
						return true;
					}
				}

				if (!paymentDueWeek.SystemValueValue) {
					logger.error({ text: 'Missing PaymentDueWeek property:', paymentDueWeek });

					return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=MissingSystemProperty`;
				}

				const lastRegistrationWeek = parseInt(paymentDueWeek.SystemValueValue, 10);

				if (currentWeek.GameWeek > lastRegistrationWeek) {
					return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=RegistrationOver`;
				}

				return true;
			} catch (error) {
				logger.error({ text: 'Failed to sign in user: ', error });

				return false;
			} finally {
				if (connection) connection.end();
			}
		},
		async redirect (url, baseUrl) {
			logger.debug({ text: '~~~redirect: ', baseUrl, url });

			if (!url.startsWith(baseUrl)) return `${baseUrl}${url.startsWith('/') ? url : ''}`;

			if (url.includes('logout')) return baseUrl;

			if (url.includes('_next')) return baseUrl;

			return url;
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

			logger.debug({ text: '~~~session:', session, user });

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
			logger.debug({ text: '~~~~signIn: ', message });
			await writeLog(
				LogAction.Login,
				`${message.user.email} signed in`,
				`${message.user.id}`,
			);
		},
		async signOut (message: null | Session): Promise<void> {
			logger.debug({ text: '~~~~signOut: ', message });
			await writeLog(
				LogAction.Logout,
				`${message?.email ?? message?.user?.email ?? message?.userId} signed out`,
				`${message?.id}`,
			);
		},
		async createUser (message): Promise<void> {
			logger.debug({ text: '~~~~createUser: ', message });
			await writeLog(
				LogAction.CreatedAccount,
				`${message.email} created an account`,
				`${message.id}`,
			);
		},
		async linkAccount (message): Promise<void> {
			logger.debug({ text: '~~~linkAccount: ', message });
			await writeLog(
				LogAction.LinkedAccount,
				`${message.user.email} linked ${message.providerAccount.provider} account`,
				`${message.user.id}`,
			);
		},
		async session (message: { session: Session }, ...rest: unknown[]): Promise<void> {
			logger.debug({ text: '~~~session: ', message, rest });
		},
		async error (message): Promise<void> {
			logger.debug({ text: '~~~error: ', message });
			await writeLog(
				LogAction.AuthenticationError,
				`{message.email} had an authentication error`,
				`{message.sub}`,
			);
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
export default withSentry(
	async (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
		NextAuth(req, res, options),
);
