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
import { GetStaticProps } from 'next';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import Image from 'next/image';

const Logout: FC = () => {
	const [session, loading] = useSession();
	const router = useRouter();

	useEffect(() => {
		const handleSignOut = async (): Promise<void> => {
			if (loading) return;

			if (session) {
				await signOut({
					redirect: false,
				});
			}

			await router.replace('/auth/login');
		};

		handleSignOut();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, loading]);

	return (
		<div className="text-center w-100 position-absolute top-50 start-50 translate-middle">
			<h1 className="text-white">
				<Image height={200} src="/spinningfootball.gif" width={200} />
				<div className="mt-n4">Logging out...</div>
			</h1>
		</div>
	);
};

Logout.whyDidYouRender = true;

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	return { props: {} };
};

// ts-prune-ignore-next
export default Logout;
