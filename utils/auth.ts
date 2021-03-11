import axios from 'axios';

import { NEXT_PUBLIC_API_URL } from './constants';

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
	}
};
