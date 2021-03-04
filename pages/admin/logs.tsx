import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const AdminLogs: FC = () => (
	<Authenticated isAdmin>
		<Head>
			<title>{getPageTitle('View All Logs')}</title>
		</Head>
		<h1>Admin Logs</h1>
	</Authenticated>
);

AdminLogs.whyDidYouRender = true;

// ts-prune-ignore-next
export default AdminLogs;
