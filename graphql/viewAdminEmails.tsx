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
import { User } from '@sentry/nextjs';
import { gql } from 'graphql-request';

import { Email, EmailResult } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

export type EmailResponse = Pick<
	Email,
	'emailID' | 'emailType' | 'to' | 'subject' | 'html' | 'textOnly' | 'sms' | 'createdAt'
> & {
	toUsers: Array<
		Pick<User, 'userID' | 'userEmail' | 'userPhone' | 'userFirstName' | 'userLastName'>
	>;
};

type LoadAdminEmailsResponse = {
	loadEmails: Pick<EmailResult, 'count' | 'hasMore' | 'lastKey'> & {
		results: Array<EmailResponse>;
	};
};

type LoadAdminEmailsInput = {
	count: number;
	lastKey: null | string;
};

const query = gql`
	query LoadEmails($count: Int!, $lastKey: String) {
		loadEmails(Count: $count, LastKey: $lastKey) {
			count
			hasMore
			lastKey
			results {
				emailID
				emailType
				to
				toUsers {
					userID
					userEmail
					userPhone
					userFirstName
					userLastName
				}
				subject
				html
				textOnly
				sms
				createdAt
			}
		}
	}
`;

export const loadEmails = (
	count: number,
	lastKey: null | string,
): Promise<LoadAdminEmailsResponse> =>
	fetcher<LoadAdminEmailsResponse, LoadAdminEmailsInput>(query, {
		count,
		lastKey,
	});
