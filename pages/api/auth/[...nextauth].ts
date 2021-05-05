import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
// eslint-disable-next-line import/no-named-as-default
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
import { TUser } from '../../../models/User';
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
		async signIn (message: TSignInMessage): Promise<void> {
			await writeLog(
				LogAction.Login,
				`${message.user.email} signed in`,
				`${message.user.id}`,
			);
		},
		async signOut (message: TAuthUser): Promise<void> {
			await writeLog(LogAction.Logout, `${message.email} signed out`, `${message.id}`);
		},
		async createUser (message: TUser, ...rest): Promise<void> {
			log.debug('~~~~createUser: ', { message, rest });
			await writeLog(
				LogAction.CreatedAccount,
				`${message.email} created an account`,
				`${message.id}`,
			);
		},
		async linkAccount (message: TLinkAccountMessage, ...rest): Promise<void> {
			log.debug('~~~linkAccount: ', { message, rest });
			await writeLog(
				LogAction.LinkedAccount,
				`${message.user.email} linked ${message.providerAccount.provider} account`,
				`${message.user.id}`,
			);
		},
		// async session (message): Promise<void> {
		// 	console.log('Session event:', message);
		// },
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
