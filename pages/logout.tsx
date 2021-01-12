import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../utils';

const Logout: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('Logout')}</title>
		</Head>
		<h1>Logout</h1>
	</div>
);

// ts-prune-ignore-next
export default Logout;
