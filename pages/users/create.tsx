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
import { GetServerSideProps } from 'next';
import React, { FC, useContext, useEffect } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { TUser } from '../../models/User';
import {
	isSignedInSSR,
	isDoneRegisteringSSR,
	UNAUTHENTICATED_REDIRECT,
	IS_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import FinishRegistrationForm from '../../components/FinishRegistrationForm/FinishRegistrationForm';
import FinishRegistrationLoader from '../../components/FinishRegistrationForm/FinishRegistrationLoader';
import { useFinishRegistrationQuery } from '../../graphql/create';
import CustomHead from '../../components/CustomHead/CustomHead';
import { BackgroundLoadingContext } from '../../utils/context';

type CreateProfileProps = {
	user: TUser;
};

const CreateProfile: FC<CreateProfileProps> = () => {
	const { data, error, isValidating } = useFinishRegistrationQuery();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);

	useEffect(() => {
		setBackgroundLoading(!!data && isValidating);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isValidating]);

	if (error) {
		console.error('Error when loading finish registration form', error);
	}

	return (
		<Authenticated>
			<CustomHead title="Finish Registration" />
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				{data ? (
					<FinishRegistrationForm
						currentUser={data.getCurrentUser}
						currentWeek={data.getCurrentWeek}
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
