import { signIn, signOut } from 'next-auth/client';
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../components/Authenticated/Authenticated';
import { getPageTitle } from '../utils';

const Dashboard: FC = () => (
	<Authenticated isRegistered>
		<Head>
			<title>{getPageTitle('My Dashboard')}</title>
		</Head>
		<h1>Dashboard</h1>
		<button
			type="button"
			onClick={async (): Promise<void> => await signIn('google')}
		>
			Link Google Account
		</button>
		<button
			type="button"
			onClick={async (): Promise<void> => await signIn('twitter')}
		>
			Link Twitter Account
		</button>
		<button type="button" onClick={async (): Promise<void> => await signOut()}>
			Sign Out
		</button>
	</Authenticated>
);

Dashboard.whyDidYouRender = true;

// ts-prune-ignore-next
export default Dashboard;
