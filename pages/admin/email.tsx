import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const AdminEmail: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('Email Users')}</title>
		</Head>
		<h1>Admin Email</h1>
	</div>
);

// ts-prune-ignore-next
export default AdminEmail;
