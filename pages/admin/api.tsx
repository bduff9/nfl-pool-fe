import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const AdminAPICalls: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('API History')}</title>
		</Head>
		<h1>Admin API Calls</h1>
	</div>
);

// ts-prune-ignore-next
export default AdminAPICalls;
