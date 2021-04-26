import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { TUser } from '../../models/User';
import { getPageTitle } from '../../utils';
import {
	isSignedInSSR,
	isDoneRegisteringSSR,
	UNAUTHENTICATED_REDIRECT,
	IS_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { usePageTitle } from '../../utils/hooks';

type CreateProfileProps = {
	user: TUser;
};

const CreateProfile: FC<CreateProfileProps> = () => {
	const [title] = usePageTitle('Finish Registration');

	return (
		<Authenticated>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<h1>{title}</h1>
		</Authenticated>
	);
};

CreateProfile.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isDoneRegistering = isDoneRegisteringSSR(session);

	if (isDoneRegistering) {
		return IS_DONE_REGISTERING_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default CreateProfile;
