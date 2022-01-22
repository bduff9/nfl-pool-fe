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
import { promises as fs } from 'fs';
import path from 'path';

import clsx from 'clsx';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { VFC, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/client';

import styles from '../styles/404.module.scss';
import { write404Log } from '../graphql/404';
import { TSessionUser } from '../utils/types';
import CustomHead from '../components/CustomHead/CustomHead';
import { getRandomInteger } from '../utils/numbers';

type NotFoundProps = {
	images: Array<string>;
};

const NotFound: VFC<NotFoundProps> = ({ images }) => {
	const router = useRouter();
	const [session, loading] = useSession();
	const image = useMemo<string>(
		() => images[getRandomInteger(0, images.length)],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath],
	);

	useEffect((): void => {
		const writeLog = async (): Promise<void> => {
			const userID = (session?.user as TSessionUser)?.id;

			await write404Log(userID, router.asPath);
		};

		if (!loading) {
			writeLog();
		}
	}, [router.asPath, session, loading]);

	return (
		<div className="row">
			<CustomHead title="404" />
			<div className="content-bg position-absolute top-50 start-50 translate-middle border border-dark rounded-3 text-dark pb-4 col-md-6">
				<h1 className="text-center">What have you done?!</h1>
				<div className={clsx('mx-auto', 'position-relative', styles['image-404'])}>
					<Image
						alt="Okay, this part was us."
						layout="fill"
						objectFit="contain"
						objectPosition="center center"
						src={image}
					/>
				</div>
				<h4 className="text-center">
					Something has gone wrong. It might be because of you. It might be because of us.
					Either way, this is awkward.
				</h4>
				<div className="text-center">
					<Link href="/">
						<a className="bare-link">
							Please click here to get us both out of this situation
						</a>
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
