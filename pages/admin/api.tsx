import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const AdminAPICalls: FC = () => (
	<Authenticated isAdmin>
		<Head>
			<title>{getPageTitle('API History')}</title>
		</Head>
		<h1>Admin API Calls</h1>
	</Authenticated>
);

AdminAPICalls.whyDidYouRender = true;

// ts-prune-ignore-next
export default AdminAPICalls;
