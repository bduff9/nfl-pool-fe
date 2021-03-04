import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

//TODO: get actual week value
const selectedWeek = 1;

const ViewAllPicks: FC = () => (
	<Authenticated isRegistered>
		<Head>
			<title>{getPageTitle(`View all week ${selectedWeek} picks`)}</title>
		</Head>
		<h1>View All Picks</h1>
	</Authenticated>
);

ViewAllPicks.whyDidYouRender = true;

// ts-prune-ignore-next
export default ViewAllPicks;
