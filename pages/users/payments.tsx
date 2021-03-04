import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const ViewPayments: FC = () => (
	<Authenticated isRegistered>
		<Head>
			<title>{getPageTitle('View Payments')}</title>
		</Head>
		<h1>View Payments</h1>
	</Authenticated>
);

ViewPayments.whyDidYouRender = true;

// ts-prune-ignore-next
export default ViewPayments;
