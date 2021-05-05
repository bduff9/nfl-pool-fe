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

export const getNameParts = (fullName: string): [string, string] => {
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
