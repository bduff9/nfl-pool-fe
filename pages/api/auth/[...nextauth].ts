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
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import TwitterProvider from 'next-auth/providers/twitter';

import prisma from '../../../lib/prismadb';

import { LogAction } from 'generated/graphql';
import { writeLog } from 'graphql/[...nextauth]';
import { mxExists, sendLoginEmailViaAPI } from 'utils/auth.server';
import {
	WEEKS_IN_SEASON,
	DAYS_IN_WEEK,
	HOURS_IN_DAY,
	MINUTES_IN_HOUR,
	SECONDS_IN_MINUTE,
} from 'utils/constants';
import type { TAuthUser, TSessionUser } from 'utils/types';
import { logger } from 'utils/logging';

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

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async signIn({ account, profile, user }): Promise<boolean | string> {
			logger.debug({ text: '~~~Signin:', account, profile, user });

			//FIXME: type guard here?
			const isBanned = (user as unknown as TAuthUser).isTrusted === false;

			if (isBanned) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=NotAllowed`;
			}

			const isValidMX = !!user.email && (await mxExists(user.email));
			const userExists = (user as unknown as TAuthUser).doneRegistering;

			if (!isValidMX) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=InvalidEmail`;
			}

			if (userExists) return true;

			try {
				const userPromise = prisma.user.findFirst({
					where: { email: user.email ?? '', deleted: null },
				});
				// const userPromise = getOne<
				// 	| {
				// 			UserID: number;
				// 			UserName: null | string;
				// 			UserFirstName: null | string;
				// 			UserLastName: null | string;
				// 			UserImage: null | string;
				// 			UserDoneRegistering: boolean;
				// 		}
				// 	| undefined,
				// 	[string]
				// >(connection, 'SELECT * FROM Users WHERE UserEmail = ? AND UserDeleted IS NULL', [
				// 	user.email ?? '',
				// ]);
				const paymentDueWeekPromise = prisma.systemValue.findFirstOrThrow({
					where: { SystemValueName: 'PaymentDueWeek', SystemValueDeleted: null },
				});
				// const paymentDueWeekPromise = getOne<{ SystemValueValue: string }, [string]>(
				// 	connection,
				// 	'SELECT SystemValueValue FROM SystemValues WHERE SystemValueName = ? AND SystemValueDeleted IS NULL',
				// 	['PaymentDueWeek'],
				// );
				const currentWeekPromise = prisma.$queryRaw<
					Array<{ GameWeek: number }>
				>`SELECT COALESCE(MIN(GameWeek), ${WEEKS_IN_SEASON}) AS GameWeek FROM Games WHERE GameStatus <> 'Final' AND GameDeleted IS NULL`;
				// const currentWeekPromise = getOne<{ GameWeek: number }, [string]>(
				// 	connection,
				// 	`SELECT COALESCE(MIN(GameWeek), ${WEEKS_IN_SEASON}) AS GameWeek FROM Games WHERE GameStatus <> ? AND GameDeleted IS NULL`,
				// 	['Final'],
				// );
				const userOwesPromise = prisma.$queryRaw<
					Array<{ owes: number }>
				>`SELECT SUM(P.PaymentAmount) < 0 AS owes FROM Payments P JOIN Users U ON U.UserID = P.UserID WHERE U.UserEmail = ${
					user.email ?? ''
				}`;
				// const userOwesPromise = getOne<{ owes: null | 0 | 1 }, [string]>(
				// 	connection,
				// 	`select sum(P.PaymentAmount) < 0 as owes from Payments P join Users U on U.UserID = P.UserID where U.UserEmail = ?`,
				// 	[user.email ?? ''],
				// );

				const [userResult, paymentDueWeek, currentWeek, userOwes] = await Promise.all([
					userPromise,
					paymentDueWeekPromise,
					currentWeekPromise,
					userOwesPromise,
				]);

				if (userResult) {
					if (!userResult.name) {
						if (profile?.name) {
							await prisma.$executeRaw`UPDATE Users SET UserName = ${profile.name} WHERE UserID = ${userResult.id}`;
							// await getAll<Record<string, unknown>, [string, number]>(
							// 	connection,
							// 	'UPDATE Users SET UserName = ? WHERE UserID = ?',
							// 	[profile.name, userResult.id],
							// );
						} else if (
							//TODO: see if given and family name still exist on profile
							userResult.first_name /* || profile?.given_name */ &&
							userResult.last_name /* || profile?.family_name */
						) {
							await prisma.$executeRaw`UPDATE Users SET UserName = ${`${
								userResult.first_name /* || profile.given_name */
							} ${userResult.last_name /* || profile.family_name */}`} WHERE UserID = ${
								userResult.id
							}`;
							// await getAll<Record<string, unknown>, [string, number]>(
							// 	connection,
							// 	'UPDATE Users SET UserName = ? WHERE UserID = ?',
							// 	[
							// 		`${userResult.first_name /* || profile.given_name */} ${
							// 			userResult.last_name /* || profile.family_name */
							// 		}`,
							// 		userResult.id,
							// 	],
							// );
						}
					}

					// if (!userResult.UserFirstName && profile.given_name) {
					// 	await getAll<Record<string, unknown>, [string, number]>(
					// 		connection,
					// 		'UPDATE Users SET UserFirstName = ? WHERE UserID = ?',
					// 		[profile.given_name as string, userResult.UserID],
					// 	);
					// }

					// if (!userResult.UserLastName && profile.family_name) {
					// 	await getAll<Record<string, unknown>, [string, number]>(
					// 		connection,
					// 		'UPDATE Users SET UserLastName = ? WHERE UserID = ?',
					// 		[profile.family_name as string, userResult.UserID],
					// 	);
					// }

					if (
						!userResult.image &&
						profile?.image
						// (profile.picture || profile.profile_image_url_https)
					) {
						await prisma.$executeRaw`UPDATE Users SET UserImage = ${profile.image} WHERE UserID = ${userResult.id}`;
						// await getAll<Record<string, unknown>, [string, number]>(
						// 	connection,
						// 	'UPDATE Users SET UserImage = ? WHERE UserID = ?',
						// 	[
						// 		profile.image,
						// 		// (profile.picture || profile.profile_image_url_https) as string,
						// 		userResult.id,
						// 	],
						// );
					}

					if (userResult.done_registering) {
						return true;
					}
				}

				if (!paymentDueWeek.SystemValueValue) {
					logger.error({ text: 'Missing PaymentDueWeek property:', paymentDueWeek });

					return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=MissingSystemProperty`;
				}

				const lastRegistrationWeek = parseInt(paymentDueWeek.SystemValueValue, 10);

				if (currentWeek[0].GameWeek > lastRegistrationWeek) {
					if (userOwes[0].owes === 1) {
						return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=LatePayment`;
					}

					return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=RegistrationOver`;
				}

				return true;
			} catch (error) {
				logger.error({ text: 'Failed to sign in user: ', error });

				return false;
			}
		},
		async redirect({ baseUrl, url }) {
			logger.debug({ text: '~~~redirect: ', baseUrl, url });

			if (!url.startsWith(baseUrl)) {
				return `${baseUrl}${url.startsWith('/') ? url : ''}`;
			}

			if (url.includes('logout')) return baseUrl;

			if (url.includes('_next')) return baseUrl;

			return url;
		},
		async session({ session, user }) {
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
			} = user as unknown as TAuthUser;

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
		async signIn(message): Promise<void> {
			logger.debug({ text: '~~~~signIn: ', message });
			await writeLog(
				LogAction.Login,
				`${message.user.email} signed in`,
				`${message.user.id}`,
			);
		},
		async signOut(message): Promise<void> {
			logger.debug({ text: '~~~~signOut: ', message });
			await writeLog(
				LogAction.Logout,
				`${message.session.user?.name ?? message.session.user?.email} signed out`,
				`${message.token}`,
			);
		},
		async createUser(message): Promise<void> {
			logger.debug({ text: '~~~~createUser: ', message });
			await writeLog(
				LogAction.CreatedAccount,
				`${message.user.email} created an account`,
				`${message.user.id}`,
			);
		},
		async linkAccount(message): Promise<void> {
			logger.debug({ text: '~~~linkAccount: ', message });
			await writeLog(
				LogAction.LinkedAccount,
				`${message.user.email} linked ${message.account.provider} account`,
				`${message.user.id}`,
			);
		},
		async session(message): Promise<void> {
			logger.debug({ text: '~~~session: ', message });
		},
		async updateUser(message): Promise<void> {
			logger.debug({ text: '~~~updateUser: ', message });
			await writeLog(
				LogAction.UpdatedAccount,
				`${message.user.email} updated their account`,
				`${message.user.id}`,
			);
		},
	},
	pages: {
		newUser: '/users/create',
		signIn: '/auth/login',
		signOut: '/auth/logout',
	},
	secret,
	session: {
		maxAge:
			(WEEKS_IN_SEASON + 3) *
			DAYS_IN_WEEK *
			HOURS_IN_DAY *
			MINUTES_IN_HOUR *
			SECONDS_IN_MINUTE,
	},
	providers: [
		EmailProvider({
			sendVerificationRequest: sendLoginEmailViaAPI,
		}),
		GoogleProvider({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET,
		}),
		TwitterProvider({
			clientId: TWITTER_ID,
			clientSecret: TWITTER_SECRET,
		}),
	],
};

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
	// Do whatever you want here, before the request is passed down to `NextAuth`
	return await NextAuth(req, res, authOptions);
};

// ts-prune-ignore-next
export default // withSentry(
auth; //,
// async (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
// 	NextAuth(req, res, options),
//);
