import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const AdminEmail: FC = () => (
	<Authenticated isAdmin>
		<Head>
			<title>{getPageTitle('Email Users')}</title>
		</Head>
		<h1>Admin Email</h1>
	</Authenticated>
);

AdminEmail.whyDidYouRender = true;

// ts-prune-ignore-next
export default AdminEmail;
