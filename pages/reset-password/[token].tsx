import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';

const ResetPassword: FC = () => {
	const router = useRouter();
	const { token } = router.query;

	return (
		<div>
			<Head>
				<title>{getPageTitle('Reset Password')}</title>
			</Head>
			<h1>Reset Password</h1>
			<ul>
				<li>Token {token}</li>
			</ul>
		</div>
	);
};

// ts-prune-ignore-next
export default ResetPassword;
