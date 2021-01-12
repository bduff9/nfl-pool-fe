import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const AdminLogs: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('View All Logs')}</title>
		</Head>
		<h1>Admin Logs</h1>
	</div>
);

// ts-prune-ignore-next
export default AdminLogs;
