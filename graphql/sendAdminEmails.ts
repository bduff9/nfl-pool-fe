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
import { gql } from 'graphql-request';

import { fetcher } from '../utils/graphql';

type SendAdminEmailInput = {
	emailType: string;
	sendTo: string;
	userEmail: null | string;
	userFirstName: null | string;
};

type SendAdminEmailResult = {
	quickPick: true;
};

const sendAdminEmailMutation = gql`
	mutation SendAdminEmail(
		$emailType: EmailType!
		$sendTo: EmailSendTo!
		$userEmail: String
		$userFirstName: String
	) {
		sendAdminEmail(
			EmailType: $emailType
			SendTo: $sendTo
			UserEmail: $userEmail
			UserFirstname: $userFirstName
		)
	}
`;

export const sendAdminEmail = (
	emailType: string,
	sendTo: string,
	userEmail: null | string,
	userFirstName: null | string,
): Promise<SendAdminEmailResult> =>
	fetcher<SendAdminEmailResult, SendAdminEmailInput>(sendAdminEmailMutation, {
		emailType,
		sendTo,
		userEmail,
		userFirstName,
	});
