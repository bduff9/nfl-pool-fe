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

import { GetStaticProps } from 'next';
import Image from 'next/image';
import React, { VFC, useMemo } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import CustomHead from '../components/CustomHead/CustomHead';
import { getRandomInteger } from '../utils/numbers';
import styles from '../styles/_offline.module.scss';

type OfflinePageProps = {
	images: Array<string>;
};

const OfflinePage: VFC<OfflinePageProps> = ({ images }) => {
	const router = useRouter();
	const image = useMemo<string>(
		() => images[getRandomInteger(0, images.length)],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath],
	);

	return (
		<div className="row">
			<CustomHead title="You are offline" />
			<div className="content-bg position-absolute top-50 start-50 translate-middle border border-dark rounded-3 text-dark py-4 col-md-6">
				<h1 className="text-center">Network Connectivity Issue</h1>
				<div className={clsx('mx-auto', 'position-relative', styles['image-offline'])}>
					<Image
						alt="Okay, this part was us."
						layout="fill"
						objectFit="contain"
						objectPosition="center center"
						src={image}
					/>
				</div>
				<h4 className="text-center pt-3 pb-4">
					It looks like you are currently offline.
					<br />
					Please reload the page once you are back online
				</h4>
				<div className="text-center">
					or if you&apos;re lazy
					<br />
					<a
						className="bare-link"
						href="#"
						onClick={event => {
							event.preventDefault();
							router.reload();
						}}
					>
						Click here to get us both out of this situation
					</a>
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

OfflinePage.whyDidYouRender = true;

// ts-prune-ignore-next
export default OfflinePage;
