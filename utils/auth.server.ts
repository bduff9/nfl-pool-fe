import dns from 'dns';
import { ParsedUrlQuery } from 'querystring';

import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/client';
import { Session } from 'next-auth';

import { TUser } from '../models/User';

import {
	NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_SITE_URL,
	REDIRECT_COOKIE_NAME,
} from './constants';

export const mxExists = async (email: string): Promise<boolean> => {
	try {
		const hostName = email.split('@')[1];
		const addresses = await dns.promises.resolveMx(hostName);

		return addresses?.every(address => address.exchange);
	} catch (error) {
		console.error('mx check error:', error);

		return false;
	}
};

type TSendVerificationRequest = (args: {
	baseUrl: string;
	identifier: string;
	provider: {
		name?: string;
		server?:
			| string
			| {
					host: string;
					port: number;
					auth: {
						user: string;
						pass: string;
					};
			  };
		from?: string;
		maxAge?: number;
	};
	token: string;
	url: string;
}) => Promise<void>;

export const sendLoginEmailViaAPI: TSendVerificationRequest = async ({
	identifier: email,
	url,
}): Promise<void> => {
	try {
		await axios.get(
			`${NEXT_PUBLIC_API_URL}/api/emails?email=${encodeURIComponent(
				email,
			)}&url=${encodeURIComponent(url)}`,
		);
		console.log('Successfully sent login email', { email });
	} catch (error) {
		console.error('Failed to send login email', {
			email,
			error,
			url,
		});
		throw error;
	}
};

export const isSignedInSSR = async (
	context: GetServerSidePropsContext<ParsedUrlQuery>,
): Promise<null | Session> => {
	const { req, res } = context;
	const session = await getSession({ req });

	if (!session) {
		res.setHeader(
			'Set-Cookie',
			`${REDIRECT_COOKIE_NAME}=${NEXT_PUBLIC_SITE_URL}${req.url || '/'}`,
		);
		//FIXME: Workaround for bug in NextAuth: https://github.com/nextauthjs/next-auth/issues/1542
		res.setHeader(
			'Set-Cookie',
			`next-auth.callback-url=${NEXT_PUBLIC_SITE_URL}${req.url || '/'}`,
		);
		res.writeHead(301, { Location: '/auth/login' }).end();
	}

	return session;
};

// ts-prune-ignore-next
export const isAdminSSR = (
	context: GetServerSidePropsContext<ParsedUrlQuery>,
	session: Session,
	redirectTo = '/',
): boolean => {
	const { res } = context;
	const { user } = session;
	const { isAdmin } = user as TUser;

	if (!isAdmin) {
		res.writeHead(301, { Location: redirectTo }).end();
	}

	return isAdmin;
};

export const isDoneRegisteringSSR = (
	context: GetServerSidePropsContext<ParsedUrlQuery>,
	session: Session,
): boolean => {
	const { res } = context;
	const { user } = session;
	const { doneRegistering } = user as TUser;

	if (!doneRegistering) {
		res.writeHead(301, { Location: '/users/create' }).end();
	}

	return doneRegistering;
};
