import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

//import styles from './Authenticated.module.scss';

type AuthenticatedProps = {
	isAdmin?: boolean;
	isRegistered?: boolean;
	isSurvivorPlayer?: boolean;
};

const Authenticated: FC<AuthenticatedProps> = ({ children }): JSX.Element => {
	const [session, loading] = useSession();
	const router = useRouter();

	if (loading) return <div>Loading...</div>;

	if (!session) {
		router.push('/auth/login');

		return <></>;
	}

	//TODO: check flags for whether to allow or redirect

	return <div className="h-100 row">{children}</div>;
};

Authenticated.whyDidYouRender = true;

export default Authenticated;
