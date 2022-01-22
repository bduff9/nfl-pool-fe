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
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { VFC } from 'react';

import { TAuthUser } from '../../utils/types';

//import styles from './Authenticated.module.scss';

type AuthenticatedProps = {
	children: JSX.Element | Array<JSX.Element>;
	isAdmin?: boolean;
	isRegistered?: boolean;
	isSurvivorPlayer?: boolean;
};

const Authenticated: VFC<AuthenticatedProps> = ({
	children,
	isAdmin,
	isRegistered,
	isSurvivorPlayer,
}): JSX.Element => {
	const [session, loading] = useSession();
	const router = useRouter();

	if (loading) return <></>;

	if (!session) {
		router.push('/auth/login');

		return <></>;
	}

	const user = session.user as TAuthUser;

	if (isAdmin && !user.isAdmin) {
		router.push('/');

		return <></>;
	}

	if (isRegistered && !user.doneRegistering) {
		router.push('/users/create');

		return <></>;
	}

	if (isSurvivorPlayer && !user.hasSurvivor) {
		router.push('/');

		return <></>;
	}

	return <div className="h-100 row">{children}</div>;
};

Authenticated.whyDidYouRender = true;

export default Authenticated;
