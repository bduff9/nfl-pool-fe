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
import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import { isUser } from '~/guards/auth';

type UseUser =
	| {
			user: User | null;
			redirected: true;
	  }
	| {
			user: User;
			redirected: false;
	  };

export const useIsDoneRegistering = (session: Session | null): UseUser => {
	const router = useRouter();
	const user = session?.user;

	if (!isUser(user)) {
		router.replace('/auth/login');

		return { redirected: true, user: null };
	}

	if (!user.done_registering) {
		router.replace('/users/create');

		return { redirected: true, user };
	}

	return { redirected: false, user };
};
