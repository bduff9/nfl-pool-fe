import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const VerifyEmail: FC = () => {
	const router = useRouter();
	const { token } = router.query;

	return (
		<div>
			<Head>
				<title>{getPageTitle('Verify Email')}</title>
			</Head>
			<h1>Verify Email</h1>
			<ul>
				<li>Token {token}</li>
			</ul>
		</div>
	);
};

// ts-prune-ignore-next
export default VerifyEmail;
