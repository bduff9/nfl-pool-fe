import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

//import styles from './Unauthenticated.module.scss';

const Unauthenticated: FC = ({ children }): JSX.Element => {
	const [session, loading] = useSession();
	const router = useRouter();

	if (loading) return <div>Loading...</div>;

	if (session) {
		router.push('/');

		return <></>;
	}

	return <>{children}</>;
};

Unauthenticated.whyDidYouRender = true;

export default Unauthenticated;
