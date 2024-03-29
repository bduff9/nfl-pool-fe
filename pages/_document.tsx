/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 * Home: https://asitewithnoname.com/
 */
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import {
	NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_ENV,
	NEXT_PUBLIC_SITE_URL,
} from '../utils/constants';

const appTitle = 'NFL Confidence Pool';
const appDescription = 'A confidence pool for the NFL regular season';
const appColor = '#8c8c8c';
const footballColor = '#663300';
const siteName = 'A Site With No Name';
const ogImage = `${NEXT_PUBLIC_SITE_URL}/bkgd-pitch.png`;
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
					<meta name="apple-mobile-web-app-status-bar-style" content="default" />
					<meta name="apple-mobile-web-app-status-bar" content={appColor} />
					<meta name="apple-mobile-web-app-title" content={appTitle} />
					<meta name="description" content={appDescription} />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-config" content="/browserconfig.xml" />
					<meta name="msapplication-TileColor" content={appColor} />
					<meta name="msapplication-tap-highlight" content="no" />
					<meta property="theme-color" content={appColor} />

					<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
					<link
						rel="apple-touch-icon"
						sizes="60x60"
						href="/apple-touch-icon-iphone-60x60.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="76x76"
						href="/apple-touch-icon-ipad-76x76.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="120x120"
						href="/apple-touch-icon-iphone-retina-120x120.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="152x152"
						href="/apple-touch-icon-ipad-retina-152x152.png"
					/>

					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color={footballColor} />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
					/>

					<meta name="twitter:card" content="summary" />
					<meta name="twitter:url" content={NEXT_PUBLIC_SITE_URL} />
					<meta name="twitter:title" content={appTitle} />
					<meta name="twitter:description" content={appDescription} />
					<meta name="twitter:image" content={ogImage} />
					<meta name="twitter:creator" content={twitterAccount} />
					<meta property="og:type" content="website" />
					<meta property="og:title" content={appTitle} />
					<meta property="og:description" content={appDescription} />
					<meta property="og:site_name" content={siteName} />
					<meta property="og:url" content={`${NEXT_PUBLIC_SITE_URL}/`} />
					<meta property="og:image" content={ogImage} />

					<link rel="preconnect" href={NEXT_PUBLIC_API_URL} crossOrigin="true" />

					{/*<!-- Cloudflare Web Analytics -->*/}
					{NEXT_PUBLIC_ENV === 'production' ? (
						<script
							defer
							src="https://static.cloudflareinsights.com/beacon.min.js"
							data-cf-beacon='{"token": "7948b9354d734d69b6866cecb098731f", "spa": true}'
						></script>
					) : NEXT_PUBLIC_ENV === 'preview' ? (
						<script
							defer
							src="https://static.cloudflareinsights.com/beacon.min.js"
							data-cf-beacon='{"token": "4b2c9a4eecaa4b7d85552ebc8b355c8b", "spa": true}'
						></script>
					) : null}
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
