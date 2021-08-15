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
import { log } from './logging';

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
		log.info('Successfully sent login email', { email });
	} catch (error) {
		console.error('Failed to send login email', {
			email,
			error,
			url,
		});
		throw error;
	}
};

export const UNAUTHENTICATED_REDIRECT = {
	redirect: {
		destination: '/auth/login',
		permanent: false,
	},
} as const;

export const IS_DONE_REGISTERING_REDIRECT = {
	redirect: {
		destination: '/users/edit',
		permanent: false,
	},
} as const;

export const IS_NOT_DONE_REGISTERING_REDIRECT = {
	redirect: {
		destination: '/users/create',
		permanent: false,
	},
} as const;

export const IS_NOT_ADMIN_REDIRECT = {
	redirect: {
		destination: '/',
		permanent: false,
	},
} as const;

export const isSignedInSSR = async (
	context: GetServerSidePropsContext<ParsedUrlQuery>,
): Promise<null | Session> => {
	const { req, res } = context;
	const session = await getSession({ req });

	console.log('~~~~~~~~~> req.url: ', req.url);

	if (!session) {
		const redirectUrl = req.url?.includes('auth') ? '/' : req.url ?? '/';

		res.setHeader(
			'Set-Cookie',
			`${REDIRECT_COOKIE_NAME}=${NEXT_PUBLIC_SITE_URL}${redirectUrl}; Secure; Path=/`,
		);
		//FIXME: Workaround for bug in NextAuth: https://github.com/nextauthjs/next-auth/issues/1542
		res.setHeader(
			'Set-Cookie',
			`__Secure-next-auth.callback-url=${NEXT_PUBLIC_SITE_URL}${redirectUrl}; Secure; Path=/`,
		);
	}

	return session;
};

export const isAdminSSR = (session: Session): boolean => {
	const { user } = session;
	const { isAdmin } = user as TUser;

	return isAdmin;
};

export const isDoneRegisteringSSR = (session: Session): boolean => {
	const { user } = session;
	const { doneRegistering } = user as TUser;

	return doneRegistering;
};
