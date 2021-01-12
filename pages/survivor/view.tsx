import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const ViewSurvivor: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('View Survivor Picks')}</title>
		</Head>
		<h1>View Survivor</h1>
	</div>
);

// ts-prune-ignore-next
export default ViewSurvivor;
