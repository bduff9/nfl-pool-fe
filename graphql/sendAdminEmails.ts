/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
type SendAdminEmailResult = {
	quickPick: true;
};

// const sendAdminEmailMutation = `
// 	mutation SendAdminEmail(
// 		$emailType: EmailType!
// 		$sendTo: EmailSendTo!
// 		$userEmail: String
// 		$userFirstName: String
// 		$extraData: String
// 	) {
// 		sendAdminEmail(
// 			EmailType: $emailType
// 			SendTo: $sendTo
// 			UserEmail: $userEmail
// 			UserFirstname: $userFirstName
// 			ExtraData: $extraData
// 		)
// 	}
// `;

export const sendAdminEmail = async (
	_emailType: string,
	_sendTo: string,
	_userEmail: null | string,
	_userFirstName: null | string,
	_extraData: null | string,
): Promise<SendAdminEmailResult> => ({
	quickPick: true,
});
