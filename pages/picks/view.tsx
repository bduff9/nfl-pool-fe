import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

//TODO: get actual week value
const selectedWeek = 1;

const ViewPicks: FC = () => (
	<Authenticated isRegistered>
		<Head>
			<title>{getPageTitle(`My week ${selectedWeek} picks`)}</title>
		</Head>
		<h1>View My Picks</h1>
	</Authenticated>
);

ViewPicks.whyDidYouRender = true;

// ts-prune-ignore-next
export default ViewPicks;
