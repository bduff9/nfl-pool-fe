import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const AdminUsers: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('User Admin')}</title>
		</Head>
		<h1>Admin Users</h1>
	</div>
);

// ts-prune-ignore-next
export default AdminUsers;
