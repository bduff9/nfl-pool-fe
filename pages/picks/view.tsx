import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FC, useContext } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { WeekContext } from '../../utils/context';
import { usePageTitle } from '../../utils/hooks';

const ViewPicks: FC = () => {
	const [selectedWeek] = useContext(WeekContext);
	const [title] = usePageTitle(`My week ${selectedWeek} picks`);

	return (
		<Authenticated isRegistered>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<h1>View My Picks</h1>
		</Authenticated>
	);
};

ViewPicks.whyDidYouRender = true;

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
export default ViewPicks;
