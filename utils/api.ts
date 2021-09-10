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
import axios from 'axios';
import { getSession } from 'next-auth/client';

import { EmailType } from '../generated/graphql';

import { NEXT_PUBLIC_API_URL } from './constants';

const getEmailPreviewURL = (emailType: EmailType): string =>
	`${NEXT_PUBLIC_API_URL}/api/preview/${emailType}`;

type EmailPreviewBody = {
	body: string;
	emailFormat: 'html' | 'subject' | 'text';
	emailID?: string;
	preview: string;
	sendTo?: string;
	subject: string;
	userFirstName?: string;
};

export const emailPreviewFetcher = async (
	emailType: EmailType,
	data: EmailPreviewBody,
): Promise<string> => {
	const session = await getSession({});
	const url = getEmailPreviewURL(emailType);
	const result = await axios.post<string>(url, data, {
		headers: {
			authorization: session ? `Bearer ${session.accessToken}` : undefined,
		},
	});

	return result.data;
};
