import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { TAuthUser } from '../../utils/types';

//import styles from './Authenticated.module.scss';

type AuthenticatedProps = {
	isAdmin?: boolean;
	isRegistered?: boolean;
	isSurvivorPlayer?: boolean;
};

const Authenticated: FC<AuthenticatedProps> = ({
	children,
	isAdmin,
	isRegistered,
	isSurvivorPlayer,
}): JSX.Element => {
	const [session, loading] = useSession();
	const router = useRouter();

	if (loading) return <div>Loading...</div>;

	if (!session) {
		router.push('/auth/login');

		return <></>;
	}

	const user = session.user as TAuthUser;

	if (isAdmin && !user.isAdmin) {
		router.push('/');

		return <></>;
	}

	if (isRegistered && !user.doneRegistering) {
		router.push('/users/create');

		return <></>;
	}

	if (isSurvivorPlayer && !user.hasSurvivor) {
		router.push('/');

		return <></>;
	}

	return <div className="h-100 row">{children}</div>;
};

Authenticated.whyDidYouRender = true;

export default Authenticated;
