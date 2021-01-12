import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const EditProfile: FC = () => {
	const router = useRouter();
	//FIXME: Will probably need to break this into 2 pages and remove the rewrite rule due to text content not matching error in browser
	const isCreate = router.asPath.includes('create');
	const title = isCreate ? 'Finish Registration' : 'Edit My Profile';

	return (
		<div>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<h1>{title}</h1>
		</div>
	);
};

// ts-prune-ignore-next
export default EditProfile;
