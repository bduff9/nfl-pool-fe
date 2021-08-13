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
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import React, { FC, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

import Alert from '../../components/Alert/Alert';
import AlertContainer from '../../components/AlertContainer/AlertContainer';
import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import { TUser } from '../../models/User';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isAdminSSR,
	IS_NOT_ADMIN_REDIRECT,
} from '../../utils/auth.server';
import ManageAdminPayments from '../../components/ManageAdminPayments/ManageAdminPayments';
import ManageAdminPayouts from '../../components/ManageAdminPayouts/ManageAdminPayouts';

type AdminPaymentsProps = {
	user: TUser;
};

const AdminPayments: FC<AdminPaymentsProps> = () => {
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const [successMessage, setSuccessMessage] = useState<null | string>(null);

	return (
		<Authenticated isAdmin>
			<CustomHead title="Manage Payments" />
			<AlertContainer>
				{errorMessage && (
					<Alert
						autoHide
						delay={5000}
						message={errorMessage}
						onClose={() => setErrorMessage(null)}
						title="Error!"
						type="danger"
					/>
				)}
				{successMessage && (
					<Alert
						autoHide
						delay={5000}
						message={successMessage}
						onClose={() => setSuccessMessage(null)}
						title="Success!"
						type="success"
					/>
				)}
			</AlertContainer>
			<div className={clsx('text-dark', 'my-3', 'mx-2', 'col', 'min-vh-100')}>
				<SkeletonTheme>
					<ManageAdminPayments
						setErrorMessage={setErrorMessage}
						setSuccessMessage={setSuccessMessage}
					/>
					<ManageAdminPayouts
						setErrorMessage={setErrorMessage}
						setSuccessMessage={setSuccessMessage}
					/>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

AdminPayments.whyDidYouRender = true;

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
export default AdminPayments;
