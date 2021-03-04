import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const AdminUsers: FC = () => (
	<Authenticated isAdmin>
		<Head>
			<title>{getPageTitle('User Admin')}</title>
		</Head>
		<h1>Admin Users</h1>
	</Authenticated>
);

AdminUsers.whyDidYouRender = true;

// ts-prune-ignore-next
export default AdminUsers;
