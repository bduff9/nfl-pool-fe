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
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

//import styles from './Unauthenticated.module.scss';

const Unauthenticated: FC = ({ children }): JSX.Element => {
	const [session, loading] = useSession();
	const router = useRouter();

	if (loading) return <></>;

	if (session) {
		router.push('/');

		return <></>;
	}

	return (
		<div className="h-100 row align-items-md-center justify-content-md-center">
			{children}
		</div>
	);
};

Unauthenticated.whyDidYouRender = true;

export default Unauthenticated;
