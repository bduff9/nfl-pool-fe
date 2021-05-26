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
import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import EditProfileForm from '../../components/EditProfileForm/EditProfileForm';
import EditProfileLoader from '../../components/EditProfileForm/EditProfileLoader';
import { useEditProfileQuery } from '../../graphql/edit';
import { TUser } from '../../models/User';
import { getPageTitle } from '../../utils';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { usePageTitle } from '../../utils/hooks';

type EditProfileProps = {
	user: TUser;
};

const EditProfile: FC<EditProfileProps> = () => {
	const [title] = usePageTitle('Edit My Profile');
	const { data, error } = useEditProfileQuery();

	if (error) {
		console.error('Error when loading edit profile form', error);
		throw error;
	}

	return (
		<Authenticated isRegistered>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				{data ? (
					<EditProfileForm
						currentUser={data.getCurrentUser}
						hasGoogle={data.hasGoogle}
						hasTwitter={data.hasTwitter}
						myNotifications={data.getMyNotifications}
					/>
				) : (
					<EditProfileLoader />
				)}
			</div>
		</Authenticated>
	);
};

EditProfile.whyDidYouRender = true;

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
export default EditProfile;
