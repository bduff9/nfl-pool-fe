import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../utils';

const Dashboard: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('My Dashboard')}</title>
		</Head>
		<h1>Dashboard</h1>
	</div>
);

// ts-prune-ignore-next
export default Dashboard;
