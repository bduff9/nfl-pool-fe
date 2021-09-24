import { logger } from './logging';

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
type TLoginError =
	| 'InvalidEmail'
	| 'LatePayment'
	| 'MissingSystemProperty'
	| 'NotAllowed'
	| 'OAuthAccountNotLinked'
	| 'RegistrationOver';

const isLoginError = (arg: unknown): arg is TLoginError =>
	typeof arg === 'string' && arg.trim() !== '';

export const formatError = (error: unknown): string => {
	if (isLoginError(error)) {
		switch (error) {
			case 'InvalidEmail':
				return 'It looks like your email is not valid, please double check it and try again';
			case 'LatePayment':
				return 'Your entry fee is past due, please pay immediately to regain access and avoid losing any points';
			case 'MissingSystemProperty':
				logger.error('Missing property `PaymentDueWeek`');

				return 'System error, please contact an administrator';
			case 'NotAllowed':
				return 'Your account has been blocked.  Please reach out to an administrator to resolve.';
			case 'OAuthAccountNotLinked':
				return "It looks like you haven't linked your account yet, please sign in using the previous method and then link this account to be able to use it to sign in";
			case 'RegistrationOver':
				return 'Sorry, registration is over for this year, please try again next season!';
			default:
				logger.error({ text: 'Invalid Login Error type found:', error });

				return 'Something went wrong, please try again';
		}
	}

	return '';
};
