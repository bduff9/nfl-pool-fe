import { useRouter } from 'next/router';
import React, { FC } from 'react';

const ResetPassword: FC = () => {
	const router = useRouter();
	const { token } = router.query;

	return (
		<div>
			<h1>Reset Password</h1>
			<ul>
				<li>Token {token}</li>
			</ul>
		</div>
	);
};

// ts-prune-ignore-next
export default ResetPassword;
