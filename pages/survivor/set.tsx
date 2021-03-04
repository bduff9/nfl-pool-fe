import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const SetSurvivor: FC = () => (
	<Authenticated isSurvivorPlayer>
		<Head>
			<title>{getPageTitle('Make Survivor Picks')}</title>
		</Head>
		<h1>Set Survivor</h1>
	</Authenticated>
);

SetSurvivor.whyDidYouRender = true;

// ts-prune-ignore-next
export default SetSurvivor;
