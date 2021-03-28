import { GetStaticProps } from 'next';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import React, { FC, useEffect, useState } from 'react';

// import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { getPageTitle } from '../../utils';

const Logout: FC = () => {
	const [session] = useSession();
	const [isSignedIn, setIsSignedIn] = useState<boolean>(!!session);

	useEffect(() => {
		if (isSignedIn) {
			signOut({
				redirect: false,
			}).then((): void => setIsSignedIn(false));
		} else {
			console.debug('Already logged out');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isSignedIn) {
		//TODO: render better loading animation here
		return <h1>Logging out...</h1>;
	}

	return (
		<>
			<Head>
				<title>{getPageTitle('Logout')}</title>
			</Head>
			<h1>Logout</h1>
			<div>
				<Link href="/auth/login">Return to Login</Link>
			</div>
		</>
	);
};

Logout.whyDidYouRender = true;

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	return { props: {} };
};

// ts-prune-ignore-next
export default Logout;
