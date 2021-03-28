import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

import Authenticated from '../components/Authenticated/Authenticated';
import { TUser } from '../models/User';
import { getPageTitle } from '../utils';
import { isDoneRegisteringSSR, isSignedInSSR } from '../utils/auth.server';

type DashboardProps = {
	user: TUser;
};

const Dashboard: FC<DashboardProps> = () => {
	const router = useRouter();
	const logout = useCallback(async (): Promise<void> => {
		router.push('/auth/logout');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
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
			<button type="button" onClick={async (): Promise<void> => await logout()}>
				Sign Out
			</button>
		</Authenticated>
	);
};

Dashboard.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return { props: {} };
	}

	const isDoneRegistering = isDoneRegisteringSSR(context, session);

	if (!isDoneRegistering) {
		return { props: {} };
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default Dashboard;
