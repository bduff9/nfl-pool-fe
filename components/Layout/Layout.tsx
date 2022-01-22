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
import clsx from 'clsx';
import { useSession } from 'next-auth/client';
import React, { VFC, useEffect, useState } from 'react';

import { BackgroundLoadingContext, TitleContext, WeekContext } from '../../utils/context';
import { TSessionUser } from '../../utils/types';
import Sidebar from '../Sidebar/Sidebar';

import styles from './Layout.module.scss';

type LayoutProps = {
	children: JSX.Element;
};

const Layout: VFC<LayoutProps> = ({ children }) => {
	const [session] = useSession();
	const titleContext = useState<string>('Welcome');
	const sessionWeek =
		typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('selectedWeek') : null;
	const weekContext = useState<number>(+(sessionWeek ?? '0'));
	const week = weekContext[0];
	const backgroundLoadingContext = useState<boolean>(false);
	const isBackgroundLoading = backgroundLoadingContext[0];

	useEffect(() => {
		if (week) {
			sessionStorage.setItem('selectedWeek', `${week}`);
		}
	}, [week]);

	return (
		<TitleContext.Provider value={titleContext}>
			<WeekContext.Provider value={weekContext}>
				<BackgroundLoadingContext.Provider value={backgroundLoadingContext}>
					<div className="container-fluid h-100">
						<div className="row h-100 pt-3 pt-md-0">
							{session?.user ? (
								<>
									<Sidebar user={session.user as TSessionUser} />
									<div className="h-100 col col-sm-9 offset-sm-3 ml-sm-auto ml-print-0 col-lg-10 offset-lg-2 position-relative main">
										{children}
									</div>
								</>
							) : (
								<div className="h-100 col position-relative">{children}</div>
							)}
							{isBackgroundLoading && (
								<div
									className={clsx(
										'spinner-border',
										'text-primary',
										'position-fixed',
										styles['background-loader'],
									)}
									role="status"
								>
									<span className="visually-hidden">Loading data in the background...</span>
								</div>
							)}
						</div>
					</div>
				</BackgroundLoadingContext.Provider>
			</WeekContext.Provider>
		</TitleContext.Provider>
	);
};

Layout.whyDidYouRender = true;

export default Layout;
