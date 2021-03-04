import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const ViewSurvivor: FC = () => (
	<Authenticated isSurvivorPlayer>
		<Head>
			<title>{getPageTitle('View Survivor Picks')}</title>
		</Head>
		<h1>View Survivor</h1>
	</Authenticated>
);

ViewSurvivor.whyDidYouRender = true;

// ts-prune-ignore-next
export default ViewSurvivor;
