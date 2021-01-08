import { useRouter } from 'next/router';
import React, { FC } from 'react';

const VerifyEmail: FC = () => {
	const router = useRouter();
	const { token } = router.query;

	return (
		<div>
			<h1>Verify Password</h1>
			<ul>
				<li>Token {token}</li>
			</ul>
		</div>
	);
};

export default VerifyEmail;
