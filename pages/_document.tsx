import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import { APP_URL } from '../utils/constants';

const appTitle = 'NFL Confidence Pool';
const appDescription = 'A confidence pool for the NFL regular season';
const appColor = '#8c8c8c';
const footballColor = '#663300';
const siteName = 'A Site With No Name';
const ogImage = `${APP_URL}/bkgd-pitch.png`;
const twitterAccount = '@Duffmaster33';

class MyDocument extends Document {
	render (): JSX.Element {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="application-name" content={appTitle} />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-title" content={appTitle} />
					<meta name="description" content={appDescription} />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-config" content="/browserconfig.xml" />
					<meta name="msapplication-TileColor" content={appColor} />
					<meta name="msapplication-tap-highlight" content="no" />
					<link
						rel="mask-icon"
						href="/safari-pinned-tab.svg"
						color={footballColor}
					/>
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:url" content={APP_URL} />
					<meta name="twitter:title" content={appTitle} />
					<meta name="twitter:description" content={appDescription} />
					<meta name="twitter:image" content={ogImage} />
					<meta name="twitter:creator" content={twitterAccount} />
					<meta property="og:title" content={appTitle} />
					<meta property="og:site_name" content={siteName} />
					<meta property="og:url" content={`${APP_URL}/`} />
					<meta property="og:description" content={appDescription} />
					<meta property="og:type" content="website" />
					<meta property="og:image" content={ogImage} />
					<link rel="manifest" href="/manifest.json" />
					<meta property="theme-color" content={appColor} />
					<link rel="apple-touch-icon" href="/icon-192x192.png" />
					<meta name="apple-mobile-web-app-status-bar" content={appColor} />
					{/*<!-- Cloudflare Web Analytics -->*/}
					<script
						defer
						src="https://static.cloudflareinsights.com/beacon.min.js"
						data-cf-beacon='{"token": "7948b9354d734d69b6866cecb098731f"}'
					></script>
					{/*<!-- End Cloudflare Web Analytics -->*/}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// ts-prune-ignore-next
export default MyDocument;
