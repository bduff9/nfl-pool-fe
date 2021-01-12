import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const Statistics: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('Pool Stats')}</title>
		</Head>
		<h1>Statistics</h1>
	</div>
);

// ts-prune-ignore-next
export default Statistics;
