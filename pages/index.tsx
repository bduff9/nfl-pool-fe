import { GetServerSideProps } from 'next';
import { getSession, signIn, signOut } from 'next-auth/client';
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../components/Authenticated/Authenticated';
import { getPageTitle } from '../utils';
import { NEXT_PUBLIC_SITE_URL, REDIRECT_COOKIE_NAME } from '../utils/constants';

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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession({ req });

	if (!session) {
		res.setHeader(
			'Set-Cookie',
			`${REDIRECT_COOKIE_NAME}=${NEXT_PUBLIC_SITE_URL}${req.url || '/'}`,
		);
		res.writeHead(301, { Location: '/auth/login' });
		res.end();

		return { props: {} };
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default Dashboard;
