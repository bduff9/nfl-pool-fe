import { decode, encode } from 'jwt-simple';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import { gql } from 'graphql-request';
import { WithAdditionalParams } from 'next-auth/_utils';

import Models from '../../../models';
import {
	HOURS_IN_DAY,
	MINUTES_IN_HOUR,
	SECONDS_IN_MINUTE,
	DAYS_IN_WEEK,
	WEEKS_IN_SEASON,
} from '../../../utils/constants';
import { mxExists, sendLoginEmailViaAPI } from '../../../utils/auth.server';
import { fetcher } from '../../../utils/graphql';
import {
	LogAction,
	MutationWriteLogArgs,
	QueryGetSystemValueArgs,
} from '../../../generated/graphql';
import { TUser } from '../../../models/User';
import { TUserObj } from '../../../utils/types';

const {
	DATABASE_URL,
	GOOGLE_ID,
	GOOGLE_SECRET,
	JWT_SECRET,
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

type TLinkAccountMessage = {
	user: TUser;
	providerAccount: { provider: string; type: string };
};

type TSignInMessage = {
	account: { id: string; type: string; providerAccountId: string };
	isNewUser: boolean;
	user: TUser;
};

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
			const isValidMX = !!user.email && (await mxExists(user.email));
			const userExists = (user as TUserObj).doneRegistering;

			if (!isValidMX) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=InvalidEmail`;
			}

			if (userExists) return true;

			const query = gql`
				query GetCurrentWeek($Name: String!) {
					getCurrentWeek
					getSystemValue(Name: $Name) {
						systemValueID
						systemValueName
						systemValueValue
					}
				}
			`;
			const { getCurrentWeek, getSystemValue } = await fetcher<
				{
					getCurrentWeek: number;
					getSystemValue: {
						systemValueID: number;
						systemValueName: string;
						systemValueValue: null | string;
					};
				},
				QueryGetSystemValueArgs
			>(query, { Name: 'PaymentDueWeek' });

			if (!getSystemValue.systemValueValue) {
				console.error('Missing PaymentDueWeek property:', { getSystemValue });

				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=MissingSystemProperty`;
			}

			const lastRegistrationWeek = parseInt(
				getSystemValue.systemValueValue,
				10,
			);

			if (getCurrentWeek > lastRegistrationWeek) {
				return `${NEXT_PUBLIC_SITE_URL}/auth/login?error=RegistrationOver`;
			}

			return true;
		},
		// async redirect (url: string, baseUrl: string): Promise<string> {
		// 	console.log('~~~redirect start~~~');
		// 	console.log({ baseUrl, url });
		// 	console.log('~~~redirect end~~~');

		// 	return baseUrl;
		// },
		async session (session, user) {
			const {
				isAdmin,
				isNewUser,
				isTrusted,
				doneRegistering,
				hasSurvivor,
				sub,
			} = user as TUserObj;

			session.user = {
				...session.user,
				isAdmin,
				doneRegistering,
				id: parseInt(sub || '-1', 10),
				hasSurvivor,
				isTrusted,
				isNewUser,
			};

			return session as WithAdditionalParams<Session>;
		},
		async jwt (
			token,
			user,
			_account,
			_profile,
			isNewUser,
		): Promise<Record<string, unknown>> {
			const userObj = user as TUserObj;

			token.isNewUser = isNewUser;

			if (typeof userObj?.doneRegistering === 'boolean') {
				token.doneRegistering = userObj.doneRegistering;
			}

			if (typeof userObj?.hasSurvivor === 'boolean') {
				token.hasSurvivor = userObj.hasSurvivor;
			}

			if (typeof userObj?.isAdmin === 'boolean') {
				token.isAdmin = userObj.isAdmin;
			}

			if (typeof userObj?.isTrusted === 'boolean') {
				token.isTrusted = userObj.isTrusted;
			}

			return token;
		},
	},
	events: {
		async signIn (message: TSignInMessage): Promise<void> {
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.Login,
					logMessage: `${message.user.email} signed in`,
					sub: `${message.user.id}`,
				},
			};
			const query = gql`
				mutation WriteToLog($data: WriteLogInput!) {
					writeLog(data: $data) {
						logID
					}
				}
			`;

			await fetcher<
				{
					writeLog: {
						logID: number;
					};
				},
				MutationWriteLogArgs
			>(query, args);
		},
		async signOut (message: TUserObj): Promise<void> {
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.Logout,
					logMessage: `${message.email} signed out`,
					sub: message.sub,
				},
			};
			const query = gql`
				mutation WriteToLog($data: WriteLogInput!) {
					writeLog(data: $data) {
						logID
					}
				}
			`;

			await fetcher<
				{
					writeLog: {
						logID: number;
					};
				},
				MutationWriteLogArgs
			>(query, args);
		},
		async createUser (message: TUser): Promise<void> {
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.CreatedAccount,
					logMessage: `${message.email} created an account`,
					sub: `${message.id}`,
				},
			};
			const query = gql`
				mutation WriteToLog($data: WriteLogInput!) {
					writeLog(data: $data) {
						logID
					}
				}
			`;

			await fetcher<
				{
					writeLog: {
						logID: number;
					};
				},
				MutationWriteLogArgs
			>(query, args);
		},
		async linkAccount (message: TLinkAccountMessage): Promise<void> {
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.LinkedAccount,
					logMessage: `${message.user.email} linked ${message.providerAccount.provider} account`,
					sub: `${message.user.id}`,
				},
			};
			const query = gql`
				mutation WriteToLog($data: WriteLogInput!) {
					writeLog(data: $data) {
						logID
					}
				}
			`;

			await fetcher<
				{
					writeLog: {
						logID: number;
					};
				},
				MutationWriteLogArgs
			>(query, args);
		},
		// async session (message): Promise<void> {
		// 	console.log('Session event:', message);
		// },
		async error (message): Promise<void> {
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.AuthenticationError,
					logMessage: `{message.email} had an authentication error`,
					sub: `{message.sub}`,
				},
			};
			const query = gql`
				mutation WriteToLog($data: WriteLogInput!) {
					writeLog(data: $data) {
						logID
					}
				}
			`;
			const result = await fetcher<
				{
					writeLog: {
						logID: number;
					};
				},
				MutationWriteLogArgs
			>(query, args);

			//TODO: clean up once tested
			console.log('~~~error event start~~~');
			console.log({ message, result });
			console.log('~~~error event end~~~');
		},
	},
	jwt: {
		decode: async (options): Promise<Record<string, string>> => {
			if (!options.token) return {};

			if (!JWT_SECRET) throw new Error('Missing JWT secret');

			return decode(options.token, JWT_SECRET, false, 'HS256');
		},
		encode: async (options): Promise<string> => {
			if (!JWT_SECRET) throw new Error('Missing JWT secret');

			return encode(options.token, JWT_SECRET, 'HS256');
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
		jwt: true,
		maxAge:
			(WEEKS_IN_SEASON + 3) *
			DAYS_IN_WEEK *
			HOURS_IN_DAY *
			MINUTES_IN_HOUR *
			SECONDS_IN_MINUTE,
	},
};

// ts-prune-ignore-next
export default async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => NextAuth(req, res, options);
