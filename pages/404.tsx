import { promises as fs } from 'fs';
import path from 'path';

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

type NotFoundProps = {
	images: string[];
};

const NotFound: FC<NotFoundProps> = ({ images }) => {
	const router = useRouter();
	const [session, loading] = useSession();
	const image = useMemo<string>(
		() => images[Math.floor(Math.random() * images.length)],
		[router.asPath],
	);

	useEffect((): void => {
		const writeLog = async (): Promise<void> => {
			const sub = (session?.user.id || null) as null | string;
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
				<title>{getPageTitle('404')}</title>
			</Head>
			<div className="content-bg mx-auto mt-6 pb-4 col-md-6">
				<h1 className="text-center">What have you done?!</h1>
				<div className={`mx-auto ${styles['image-404']}`}>
					<Image
						alt="Okay, this part was us."
						className="mb-4"
						height={300}
						layout="responsive"
						src={image}
						width={600}
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
