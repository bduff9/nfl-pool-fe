import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { TUser } from '../../models/User';
import { getPageTitle } from '../../utils';
import { isSignedInSSR, isDoneRegisteringSSR } from '../../utils/auth.server';

type CreateProfileProps = {
	user: TUser;
};

const CreateProfile: FC<CreateProfileProps> = () => {
	const title = 'Finish Registration';

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
		return { props: {} };
	}

	const isDoneRegistering = isDoneRegisteringSSR(context, session);

	if (isDoneRegistering) {
		context.res.writeHead(301, { Location: '/users/edit' }).end();

		return { props: {} };
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default CreateProfile;
