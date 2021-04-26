import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../utils';

//TODO: style this page per Figma
const OfflinePage: FC = () => (
	<>
		<Head>
			<title>{getPageTitle('You are offline')}</title>
		</Head>
		<h1>This is the offline fallback page</h1>
		<h2>When offline, any page route will fallback to this page</h2>
	</>
);

OfflinePage.whyDidYouRender = true;

// ts-prune-ignore-next
export default OfflinePage;
