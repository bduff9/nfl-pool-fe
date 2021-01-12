import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { getPageTitle } from '../../../utils';

const QuickPick: FC = () => {
	const router = useRouter();
	const { userId, teamShort } = router.query;

	return (
		<div>
			<Head>
				<title>{getPageTitle('Quick Pick')}</title>
			</Head>
			<h1>Quick Pick</h1>
			<ul>
				<li>User Id {userId}</li>
				<li>Team short {teamShort}</li>
			</ul>
		</div>
	);
};

// ts-prune-ignore-next
export default QuickPick;
