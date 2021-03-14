import dns from 'dns';

import axios from 'axios';

import { NEXT_PUBLIC_API_URL } from './constants';

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
