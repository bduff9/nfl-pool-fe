import * as Sentry from '@sentry/browser';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { Provider } from 'next-auth/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';

import Layout from '../components/Layout';
import { NEXT_PUBLIC_ENV, NEXT_PUBLIC_SENTRY_DSN } from '../utils/constants';

if (NEXT_PUBLIC_SENTRY_DSN) {
	Sentry.init({
		enabled: NEXT_PUBLIC_ENV === 'production',
		dsn: NEXT_PUBLIC_SENTRY_DSN,
	});
}

if (typeof window !== 'undefined' && NEXT_PUBLIC_ENV !== 'production') {
	whyDidYouRender(React);
}

type SentryProps = { err: unknown };

const App: FC<AppProps & SentryProps> = ({ Component, err, pageProps }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect((): (() => void) => {
		let mounted = true;

		const handleStart = (url: string): void => {
			if (url !== router.pathname && mounted) {
				setIsLoading(true);
			}
		};

		const handleComplete = (url: string): void => {
			if (url !== router.pathname && mounted) {
				setIsLoading(false);
			}
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return (): void => {
			mounted = false;
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Provider session={pageProps.session}>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>
			<Layout isLoading={isLoading}>
				<Component {...pageProps} err={err} />
			</Layout>
		</Provider>
	);
};

// ts-prune-ignore-next
export default App;
