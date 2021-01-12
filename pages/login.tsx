import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../utils';

const Login: FC = () => (
	<div>
		<Head>
			<title>{getPageTitle('Login')}</title>
		</Head>
		<h1>Login</h1>
	</div>
);

// ts-prune-ignore-next
export default Login;
