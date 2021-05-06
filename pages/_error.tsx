/*
NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
Copyright (C) 2015-present Brian Duffey and Billy Alexander
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see {http://www.gnu.org/licenses/}.
Home: https://asitewithnoname.com/
*/
import * as Sentry from '@sentry/browser';
import { NextPage, NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

type ErrorPageProps = {
	err?: unknown;
	hasGetInitialPropsRun?: boolean;
	statusCode: number;
};

const ErrorPage: NextPage<ErrorPageProps> = ({
	err,
	hasGetInitialPropsRun,
	statusCode,
}) => {
	if (!hasGetInitialPropsRun && err) {
		// getInitialProps is not called in case of
		// https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
		// err via _app.js so it can be captured
		Sentry.captureException(err);
	}

	return <NextErrorComponent statusCode={statusCode} />;
};

ErrorPage.getInitialProps = async ({ res, err, asPath }) => {
	const errorInitialProps = await NextErrorComponent.getInitialProps({
		res,
		err,
	} as NextPageContext);

	// Workaround for https://github.com/vercel/next.js/issues/8592, mark when
	// getInitialProps has run
	(errorInitialProps as ErrorPageProps).hasGetInitialPropsRun = true;

	// Running on the server, the response object (`res`) is available.
	//
	// Next.js will pass an err on the server if a page's data fetching methods
	// threw or returned a Promise that rejected
	//
	// Running on the client (browser), Next.js will provide an err if:
	//
	//  - a page's `getInitialProps` threw or returned a Promise that rejected
	//  - an exception was thrown somewhere in the React lifecycle (render,
	//    componentDidMount, etc) that was caught by Next.js's React Error
	//    Boundary. Read more about what types of exceptions are caught by Error
	//    Boundaries: https://reactjs.org/docs/error-boundaries.html

	if (res?.statusCode === 404) {
		// Opinionated: do not record an exception in Sentry for 404
		return { statusCode: 404 };
	}

	if (err) {
		Sentry.captureException(err);
		await Sentry.flush(2000);

		return errorInitialProps;
	}

	// If this point is reached, getInitialProps was called without any
	// information about what the error might be. This is unexpected and may
	// indicate a bug introduced in Next.js, so record it in Sentry
	Sentry.captureException(
		new Error(`_error.js getInitialProps missing data at path: ${asPath}`),
	);

	// Without this try-catch block, builds all fail since
	// Sentry.flush throws `false` here during static builds
	try {
		await Sentry.flush(2000);
	} catch (error) {
		console.error('Sentry.flush failed to be called:', error);
	}

	return errorInitialProps;
};

// ts-prune-ignore-next
export default ErrorPage;
