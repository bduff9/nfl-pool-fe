import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';
import {
	isAdminSSR,
	isSignedInSSR,
	IS_NOT_ADMIN_REDIRECT,
	UNAUTHENTICATED_REDIRECT,
} from '../../utils/auth.server';
import { usePageTitle } from '../../utils/hooks';

const AdminAPICalls: FC = () => {
	const [title] = usePageTitle('API History');

	return (
		<Authenticated isAdmin>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<h1>Admin API Calls</h1>
		</Authenticated>
	);
};

AdminAPICalls.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isAdmin = isAdminSSR(session);

	if (!isAdmin) {
		return IS_NOT_ADMIN_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default AdminAPICalls;
