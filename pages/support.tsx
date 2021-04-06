import { GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import React, { FC } from 'react';

import { getPageTitle } from '../utils';

type SupportProps = {
	rules: unknown[];
	faqs: unknown[];
	slackLink: string;
};

const Support: FC<SupportProps> = () => {
	const [session, loading] = useSession();

	//TODO: add fuse.js to search content

	return (
		<div className="h-100 row">
			<Head>
				<title>{getPageTitle('Support/FAQs')}</title>
			</Head>
			<div className="content-bg m-3 h-100 col">
				<h1>Support/FAQs</h1>
				{!session && !loading && (
					<Link href="/auth/login">
						<a>Back to login</a>
					</Link>
				)}
			</div>
		</div>
	);
};

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	//TODO: Use GQL to get list of support items

	return { props: {} };
};

Support.whyDidYouRender = true;

// ts-prune-ignore-next
export default Support;
