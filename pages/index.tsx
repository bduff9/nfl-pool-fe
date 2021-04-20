import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../components/Authenticated/Authenticated';
import SocialAuthButton from '../components/SocialAuthButton/SocialAuthButton';
import { TUser } from '../models/User';
import { getPageTitle } from '../utils';
import {
	isDoneRegisteringSSR,
	isSignedInSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
	UNAUTHENTICATED_REDIRECT,
} from '../utils/auth.server';

type DashboardProps = {
	user: TUser;
};

const Dashboard: FC<DashboardProps> = () => {
	return (
		<Authenticated isRegistered>
			<Head>
				<title>{getPageTitle('My Dashboard')}</title>
			</Head>
			<div className="col">
				<h1 className="welcome-banner">Dashboard</h1>

				<div className="d-grid gap-2 d-md-flex mb-2">
					<SocialAuthButton type="Google" />
					<SocialAuthButton type="Twitter" />
					<a className="btn btn-secondary btn-logout" href="/auth/logout">
						Sign Out
					</a>
				</div>
			</div>
		</Authenticated>
	);
};

Dashboard.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isDoneRegistering = isDoneRegisteringSSR(session);

	if (!isDoneRegistering) {
		return IS_NOT_DONE_REGISTERING_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default Dashboard;
