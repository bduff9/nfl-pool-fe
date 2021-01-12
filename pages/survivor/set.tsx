import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const SetSurvivor: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('Make Survivor Picks')}</title>
		</Head>
		<h1>Set Survivor</h1>
	</div>
);

// ts-prune-ignore-next
export default SetSurvivor;
