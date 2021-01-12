import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const ViewPayments: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('View Payments')}</title>
		</Head>
		<h1>View Payments</h1>
	</div>
);

// ts-prune-ignore-next
export default ViewPayments;
