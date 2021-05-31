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
import LogRocket from 'logrocket';
import { useSession } from 'next-auth/client';
import React, { FC, useEffect, useState } from 'react';

import { TUser } from '../../models/User';
import { TitleContext, WeekContext } from '../../utils/context';
import { TSessionUser } from '../../utils/types';
import Sidebar from '../Sidebar/Sidebar';

type LayoutProps = {
	isLoading?: boolean;
};

const Layout: FC<LayoutProps> = props => {
	const { children } = props;
	const [session, loading] = useSession();
	const titleContext = useState<string>('Welcome');
	const sessionWeek =
		typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('selectedWeek') : null;
	const weekContext = useState<number>(+(sessionWeek ?? '0'));
	const week = weekContext[0];

	useEffect((): void => {
		if (session && !loading) {
			const { name, image: picture, ...rest } = session.user as TSessionUser;

			LogRocket.identify(`${(session.user as TUser).id}`, {
				name: name || '',
				picture: picture || '',
				...rest,
			});
		}
	}, [session, loading]);

	useEffect(() => {
		if (week) {
			sessionStorage.setItem('selectedWeek', `${week}`);
		}
	}, [week]);

	//TODO: use loading to show page loading

	return (
		<TitleContext.Provider value={titleContext}>
			<WeekContext.Provider value={weekContext}>
				<div className="container-fluid h-100">
					<div className="row h-100">
						{session && session.user ? (
							<>
								<Sidebar user={session.user as TSessionUser} />
								<div className="h-100 col col-sm-9 offset-sm-3 ml-sm-auto ml-print-0 col-lg-10 offset-lg-2 main">
									{children}
								</div>
							</>
						) : (
							<div className="h-100 col">{children}</div>
						)}
					</div>
				</div>
			</WeekContext.Provider>
		</TitleContext.Provider>
	);
};

Layout.whyDidYouRender = true;

export default Layout;
