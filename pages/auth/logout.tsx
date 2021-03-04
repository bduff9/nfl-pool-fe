import Head from 'next/head';
import React, { FC } from 'react';

import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { getPageTitle } from '../../utils';

const Logout: FC = () => (
	<Unauthenticated>
		<Head>
			<title>{getPageTitle('Logout')}</title>
		</Head>
		<h1>Logout</h1>
	</Unauthenticated>
);

Logout.whyDidYouRender = true;

// ts-prune-ignore-next
export default Logout;
