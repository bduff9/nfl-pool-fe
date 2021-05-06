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
import { promises as fs } from 'fs';
import path from 'path';

import clsx from 'clsx';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useMemo } from 'react';
import { useSession } from 'next-auth/client';

import styles from '../styles/500.module.scss';
import { getPageTitle } from '../utils';
import { usePageTitle } from '../utils/hooks';

type ErrorProps = {
	images: string[];
};

const Error: FC<ErrorProps> = ({ images }) => {
	const router = useRouter();
	const [session, loading] = useSession();
	const [title] = usePageTitle('Error Occurred');
	const image = useMemo<string>(
		() => images[Math.floor(Math.random() * images.length)],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath],
	);

	return (
		<div className="row">
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<div className="content-bg position-absolute top-50 start-50 translate-middle border border-dark rounded-3 text-dark pb-4 col-md-6">
				<h1 className="text-center">Flag on the play!</h1>
				<div className={clsx('mx-auto', 'position-relative', styles['image-500'])}>
					<Image
						alt="Flag on the play"
						layout="fill"
						objectFit="contain"
						objectPosition="center center"
						src={image}
					/>
				</div>
				<h2 className="text-center">
					There has been an error.
					<br />
					<a
						className="bare-link"
						href="#"
						onClick={(event): false => {
							event.preventDefault();
							router.reload();

							return false;
						}}
					>
						Please try reloading the page
					</a>
				</h2>
				{!loading && <h4 className="text-center">or</h4>}
				{!loading && (
					<h2 className="text-center">
						{session ? (
							<Link href="/">
								<a className="bare-link">Click here to return to your dashboard</a>
							</Link>
						) : (
							<Link href="/auth/login">
								<a className="bare-link">Click here to return to the login page</a>
							</Link>
						)}
					</h2>
				)}
			</div>
		</div>
	);
};

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	const imagesDirectory = path.join(process.cwd(), 'public', '500');
	const imageNames = await fs.readdir(imagesDirectory);
	const images = imageNames.map(image => `/500/${image}`);

	return { props: { images } };
};

Error.whyDidYouRender = true;

// ts-prune-ignore-next
export default Error;
