import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
	render (): JSX.Element {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="application-name" content="NFL Confidence Pool" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta
						name="apple-mobile-web-app-title"
						content="NFL Confidence Pool"
					/>
					<meta
						name="description"
						content="A confidence pool for the NFL regular season"
					/>
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-config" content="/browserconfig.xml" />
					<meta name="msapplication-TileColor" content="#8c8c8c" />
					<meta name="msapplication-tap-highlight" content="no" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#663300" />
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:url" content="https://nfl-dev.asitewithnoname.com" />
					<meta name="twitter:title" content="NFL Confidence Pool" />
					<meta
						name="twitter:description"
						content="A confidence pool for the NFL regular season"
					/>
					<meta
						name="twitter:image"
						content="https://nfl-dev.asitewithnoname.com/icon-192x192.png"
					/>
					<meta name="twitter:creator" content="@Duffmaster33" />
					<meta property="og:title" content="NFL Confidence Pool" />
					<meta property="og:site_name" content="A Site With No Name" />
					<meta property="og:url" content="https://nfl-dev.asitewithnoname.com/" />
					<meta
						property="og:description"
						content="A confidence pool for the NFL regular season"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:image" content="https://nfl-dev.asitewithnoname.com/bkgd-pitch.png" />
					<link rel="manifest" href="/manifest.json" />
					<meta property="theme-color" content="#8c8c8c" />
					<link rel="apple-touch-icon" href="/icon-192x192.png" />
					<meta name="apple-mobile-web-app-status-bar" content="#8c8c8c" />
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
