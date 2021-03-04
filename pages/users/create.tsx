import Head from 'next/head';
import React, { FC } from 'react';

import Authenticated from '../../components/Authenticated/Authenticated';
import { getPageTitle } from '../../utils';

const CreateProfile: FC = () => {
	const title = 'Finish Registration';

	return (
		<Authenticated>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<h1>{title}</h1>
		</Authenticated>
	);
};

CreateProfile.whyDidYouRender = true;

// ts-prune-ignore-next
export default CreateProfile;
