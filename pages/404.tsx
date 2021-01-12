import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../utils';

const NotFound: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('404')}</title>
		</Head>
		<h1>404</h1>
	</div>
);

// ts-prune-ignore-next
export default NotFound;
