import { useRouter } from 'next/router';
import React, { FC } from 'react';

const QuickPick: FC = () => {
	const router = useRouter();
	const { userId, teamShort } = router.query;

	return (
		<div>
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
