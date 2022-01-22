/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
import React, { VFC, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

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
import { useCurrentUser } from '../../graphql/create';
import CustomHead from '../../components/CustomHead/CustomHead';
import { BackgroundLoadingContext } from '../../utils/context';
import { useCurrentWeek } from '../../graphql/sidebar';
import { logger } from '../../utils/logging';

type CreateProfileProps = {
	user: TUser;
};

const CreateProfile: VFC<CreateProfileProps> = ({ user }) => {
	const router = useRouter();
	const { data, error, isValidating, mutate } = useCurrentUser();
	const {
		data: currentWeekData,
		error: currentWeekError,
		isValidating: currentWeekIsValidating,
	} = useCurrentWeek();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) || (!!currentWeekData && currentWeekIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isValidating, currentWeekData, currentWeekIsValidating]);

	if (error) {
		logger.error({ text: 'Error when loading current user: ', error });
	}

	if (currentWeekError) {
		logger.error({ text: 'Error when loading current week: ', currentWeekError });
	}

	//FIXME: for some reason, the user from the server is not always up to date.  For instance, immediately after registering, users are kicked back here from the dashboard.  As a workaround, we check the cached user we mutate after registering, but this means that the dashboard will kick them here and then this screen will kick them to edit profile, so is not ideal.
	if (user.doneRegistering || data?.getCurrentUser.userDoneRegistering) {
		router.replace('/users/edit');

		return <></>;
	}

	return (
		<Authenticated>
			<CustomHead title="Finish Registration" />
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				{data && currentWeekData ? (
					<FinishRegistrationForm
						currentUser={data.getCurrentUser}
						hasGoogle={data.hasGoogle}
						hasTwitter={data.hasTwitter}
						revalidateUser={mutate}
						seasonStatus={currentWeekData.getWeek.seasonStatus}
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
