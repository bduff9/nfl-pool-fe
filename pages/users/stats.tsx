import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const Statistics: FC = () => (
	<Authenticated isRegistered>
		<Head>
			<title>{getPageTitle('Pool Stats')}</title>
		</Head>
		<h1>Statistics</h1>
	</Authenticated>
);

Statistics.whyDidYouRender = true;

// ts-prune-ignore-next
export default Statistics;
