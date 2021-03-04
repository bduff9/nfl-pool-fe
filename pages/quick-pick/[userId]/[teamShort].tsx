import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { getPageTitle } from '../../../utils';

const QuickPick: FC = () => {
	const router = useRouter();
	const { userId, teamShort } = router.query;

	//TODO: do people not need to be signed in here?  Should we generate a token to prevent abuse?
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

QuickPick.whyDidYouRender = true;

// ts-prune-ignore-next
export default QuickPick;
