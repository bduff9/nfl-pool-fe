import { promises as fs } from 'fs';
import path from 'path';

import clsx from 'clsx';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo } from 'react';
import { gql } from 'graphql-request';
import { useSession } from 'next-auth/client';

import { getPageTitle } from '../utils';
import styles from '../styles/404.module.scss';
import { LogAction, MutationWriteLogArgs } from '../generated/graphql';
import { fetcher } from '../utils/graphql';
import { usePageTitle } from '../utils/hooks';

type NotFoundProps = {
	images: string[];
};

const NotFound: FC<NotFoundProps> = ({ images }) => {
	const router = useRouter();
	const [session, loading] = useSession();
	const [title] = usePageTitle('404');
	const image = useMemo<string>(
		() => images[Math.floor(Math.random() * images.length)],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath],
	);

	useEffect((): void => {
		const writeLog = async (): Promise<void> => {
			const sub = ((session?.user as any)?.id || null) as null | string;
			const args: MutationWriteLogArgs = {
				data: {
					logAction: LogAction.Error404,
					logMessage: router.asPath,
					sub,
				},
			};
			const query = gql`
				mutation WriteToLog($data: WriteLogInput!) {
					writeLog(data: $data) {
						logID
					}
				}
			`;

			await fetcher<
				{
					writeLog: {
						logID: number;
					};
				},
				MutationWriteLogArgs
			>(query, args);
		};

		if (!loading) {
			writeLog();
		}
	}, [router.asPath, session, loading]);

	return (
		<div className="row">
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<div className="content-bg border border-dark rounded-3 text-dark mx-auto mt-6 pb-4 col-md-6">
				<h1 className="text-center">What have you done?!</h1>
				<div
					className={clsx('mx-auto', 'position-relative', styles['image-404'])}
				>
					<Image
						alt="Okay, this part was us."
						layout="fill"
						objectFit="contain"
						objectPosition="center center"
						src={image}
					/>
				</div>
				<h4 className="text-center">
					Something has gone wrong. It might be because of you. It might be
					because of us. Either way, this is awkward.
				</h4>
				<div className="text-center">
					<Link href="/">
						<a>Please click here to get us both out of this situation</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	const imagesDirectory = path.join(process.cwd(), 'public', '404');
	const imageNames = await fs.readdir(imagesDirectory);
	const images = imageNames.map(image => `/404/${image}`);

	return { props: { images } };
};

NotFound.whyDidYouRender = true;

// ts-prune-ignore-next
export default NotFound;
