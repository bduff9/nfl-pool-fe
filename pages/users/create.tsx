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
import FinishRegistrationForm from '../../components/FinishRegistrationForm/FinishRegistrationForm';
import FinishRegistrationLoader from '../../components/FinishRegistrationForm/FinishRegistrationLoader';
import { useFinishRegistrationQuery } from '../../graphql/create';

type CreateProfileProps = {
	user: TUser;
};

const CreateProfile: FC<CreateProfileProps> = () => {
	const [title] = usePageTitle('Finish Registration');
	const { data, error } = useFinishRegistrationQuery();

	if (error) {
		console.error('Error when loading finish registration form', error);
		throw error;
	}

	return (
		<Authenticated>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				{data ? (
					<FinishRegistrationForm
						currentUser={data.getCurrentUser}
						hasGoogle={data.hasGoogle}
						hasTwitter={data.hasTwitter}
					/>
				) : (
					<FinishRegistrationLoader />
				)}
			</div>
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
