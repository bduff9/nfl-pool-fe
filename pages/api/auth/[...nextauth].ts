import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
// eslint-disable-next-line import/no-named-as-default
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import { gql } from 'graphql-request';
// eslint-disable-next-line import/no-unresolved
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
import { TAuthUser } from '../../../utils/types';
import { log } from '../../../utils/logging';

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
			const userExists = (user as TAuthUser).doneRegistering;

			log.debug('~~~Signin:', { _account, _profile, user });

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
			} as any;

			return session as WithAdditionalParams<Session>;
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
		async signOut (message: TAuthUser): Promise<void> {
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.Logout,
					logMessage: `${message.email} signed out`,
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
		async createUser (message: TUser, ...rest): Promise<void> {
			log.debug('~~~~createUser: ', { message, rest });
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
		async linkAccount (message: TLinkAccountMessage, ...rest): Promise<void> {
			log.debug('~~~linkAccount: ', { message, rest });
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
export default async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => NextAuth(req, res, options);
