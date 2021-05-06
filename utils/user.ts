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
import { Maybe } from '../generated/graphql';

type NameProps = {
	userName?: Maybe<string> | undefined;
	userFirstName?: Maybe<string> | undefined;
	userLastName?: Maybe<string> | undefined;
};

export const getFullName = (user: NameProps): string => {
	if (user.userName) return user.userName;

	const firstName = user.userFirstName ?? '';
	const lastName = user.userLastName ?? '';
	const fullName = `${firstName.trim()} ${lastName.trim()}`;

	return fullName.trim();
};

const getNameParts = (fullName: string): [string, string] => {
	const words = fullName.trim().split(' ');

	if (words.length === 0) return ['', ''];

	const [firstName, ...lastNameArr] = words;

	if (words.length === 1) return [firstName, ''];

	return [firstName, lastNameArr.join(' ')];
};

export const getFirstName = (user: NameProps): string => {
	if (user.userFirstName) return user.userFirstName;

	if (!user.userName) return '';

	const [firstName] = getNameParts(user.userName);

	return firstName.trim();
};

export const getLastName = (user: NameProps): string => {
	if (user.userLastName) return user.userLastName;

	if (!user.userName) return '';

	const [, lastName] = getNameParts(user.userName);

	return lastName.trim();
};
