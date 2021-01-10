import * as Sentry from '@sentry/browser';
import { AppProps } from 'next/app';
import React, { FC } from 'react';

import Layout from '../components/Layout';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
	Sentry.init({
		enabled: process.env.NODE_ENV === 'production',
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	});
}

type SentryProps = { err: unknown };

const App: FC<AppProps & SentryProps> = ({ Component, err, pageProps }) => (
	<Layout>
		<Component {...pageProps} err={err} />
	</Layout>
);

// ts-prune-ignore-next
export default App;
