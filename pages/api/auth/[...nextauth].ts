import { decode, encode } from 'jwt-simple';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
// eslint-disable-next-line import/no-unresolved
import { SessionBase } from 'next-auth/_utils';
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

const {
	DATABASE_URL,
	EMAIL_FROM,
	EMAIL_PASSWORD,
	EMAIL_USERNAME,
	GOOGLE_ID,
	GOOGLE_SECRET,
	JWT_SECRET,
	secret,
	TWITTER_ID,
	TWITTER_SECRET,
} = process.env;

if (!DATABASE_URL) throw new Error('Missing database URL');

if (!EMAIL_PASSWORD) throw new Error('Missing email server password');

if (!EMAIL_USERNAME) throw new Error('Missing email server username');

if (!GOOGLE_ID) throw new Error('Missing Google ID');

if (!GOOGLE_SECRET) throw new Error('Missing Google secret');

if (!TWITTER_ID) throw new Error('Missing Twitter ID');

if (!TWITTER_SECRET) throw new Error('Missing Twitter secret');

const options: InitOptions = {
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
		async signIn (user, account, profile): Promise<boolean> {
			console.log('~~~signIn start~~~');
			console.log({ account, profile, user });
			console.log('~~~signIn end~~~');

			return !!(user as { id: null | number }).id;
		},
		async redirect (url, baseUrl): Promise<string> {
			console.log('~~~redirect start~~~');
			console.log({ baseUrl, url });
			console.log('~~~redirect end~~~');

			return baseUrl;
		},
		async session (session, user): Promise<SessionBase> {
			console.log('~~~session start~~~');
			console.log({ session, user });
			console.log('~~~session end~~~');

			return session;
		},
		async jwt (
			token,
			user,
			account,
			profile,
			isNewUser,
		): Promise<Record<string, unknown>> {
			console.log('~~~jwt start~~~');
			console.log({ account, isNewUser, profile, token, user });
			console.log('~~~jwt end~~~');

			return token;
		},
	},
	events: {
		async signIn (message): Promise<void> {
			console.log('~~~signIn event start~~~');
			console.log({ message });
			console.log('~~~signIn event end~~~');
		},
		async signOut (message): Promise<void> {
			console.log('~~~signOut event start~~~');
			console.log({ message });
			console.log('~~~signOut event end~~~');
		},
		async createUser (message): Promise<void> {
			console.log('~~~createUser event start~~~');
			console.log({ message });
			console.log('~~~createUser event end~~~');
		},
		async linkAccount (message): Promise<void> {
			console.log('~~~linkAccount event start~~~');
			console.log({ message });
			console.log('~~~linkAccount event end~~~');
		},
		async session (message): Promise<void> {
			console.log('~~~session event start~~~');
			console.log({ message });
			console.log('~~~session event end~~~');
		},
		async error (message): Promise<void> {
			console.log('~~~error event start~~~');
			console.log({ message });
			console.log('~~~error event end~~~');
		},
	},
	jwt: {
		decode: async (options): Promise<Record<string, string>> => {
			console.log('~~~decode start~~~');
			console.log({ options });
			console.log('~~~decode end~~~');

			if (!options.token) return {};

			if (!JWT_SECRET) throw new Error('Missing JWT secret');

			return decode(options.token, JWT_SECRET, false, 'HS256');
		},
		encode: async (options): Promise<string> => {
			console.log('~~~encode start~~~');
			console.log({ options });
			console.log('~~~encode end~~~');

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
			server: `smtps://${EMAIL_USERNAME}:${EMAIL_PASSWORD}@email-smtp.us-east-1.amazonaws.com:465`,
			from: EMAIL_FROM,
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
export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
	NextAuth(req, res, options);
