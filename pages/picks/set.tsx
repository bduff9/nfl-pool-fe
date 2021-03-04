import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

//TODO: get actual week value
const selectedWeek = 1;

const MakePicks: FC = () => (
	<Authenticated isRegistered>
		<Head>
			<title>{getPageTitle(`Make week ${selectedWeek} picks`)}</title>
		</Head>
		<h1>Make Picks</h1>
	</Authenticated>
);

MakePicks.whyDidYouRender = true;

// ts-prune-ignore-next
export default MakePicks;
