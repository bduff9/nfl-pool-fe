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
import * as Sentry from '@sentry/nextjs';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { AnimateSharedLayout } from 'framer-motion';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { Provider } from 'next-auth/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { FC } from 'react';
import { ToastContainer } from 'react-toastify';
import { syncWithLocalStorage } from 'swr-sync-storage';

import Layout from '../components/Layout/Layout';
import { NEXT_PUBLIC_ENV } from '../utils/constants';
import {
	useOfflineNotifications,
	useRouteChangeLoader,
	useServiceWorker,
} from '../utils/hooks';

import '../styles/globals.scss';
// Keep selectors for #nprogress, .bar, .peg, .spinner, & .spinner-icon
import 'nprogress/nprogress.css';

if (typeof window !== 'undefined') {
	syncWithLocalStorage();
}

if (typeof window !== 'undefined') {
	LogRocket.init('xba8kt/nfl-pool-fe');
	setupLogRocketReact(LogRocket);
	LogRocket.getSessionURL(sessionURL => {
		Sentry.configureScope(scope => {
			scope.setExtra('sessionURL', sessionURL);
		});
	});

	if (NEXT_PUBLIC_ENV !== 'production') {
		whyDidYouRender(React);
	}
}

type SentryProps = { err: unknown };

const App: FC<AppProps & SentryProps> = ({ Component, err, pageProps }) => {
	useServiceWorker();
	useRouteChangeLoader();
	useOfflineNotifications();

	return (
		<Provider session={pageProps.session}>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>
			<AnimateSharedLayout>
				<Layout>
					<Component {...pageProps} err={err} />
				</Layout>
			</AnimateSharedLayout>
			<ToastContainer theme="dark" />
		</Provider>
	);
};

// ts-prune-ignore-next
export default App;
