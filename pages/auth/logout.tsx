import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootballBall } from '@bduff9/pro-duotone-svg-icons/faFootballBall';
import { GetStaticProps } from 'next';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

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
		<div className="text-center mt-11">
			<h1>
				<FontAwesomeIcon
					className="football-brown"
					icon={faFootballBall}
					size="2x"
					spin
				/>
				&nbsp; Logging out...
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
