import { gql } from 'graphql-request';
import { GetStaticProps } from 'next';
import { signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, FormEvent, useState } from 'react';

import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { getPageTitle } from '../../utils';
import { fetcher } from '../../utils/graphql';

type TFormState = 'READY' | 'LOADING' | 'ERRORED' | 'SUBMITTED';
type LoginProps = { year: string };

const Login: FC<LoginProps> = ({ year }) => {
	const router = useRouter();
	const [session] = useSession();
	const [email, setEmail] = useState<string>('');
	const [, setError] = useState<string>('');
	const [formState, setFormState] = useState<TFormState>('READY');

	if (session) {
		router.replace('/');

		return <></>;
	}

	//TODO: useEffect here to validate MX in browser prior to submit

	return (
		<Unauthenticated>
			<Head>
				<title>{getPageTitle('Login')}</title>
			</Head>
			<h1>Login ({year})</h1>
			{formState !== 'SUBMITTED' ? (
				<form
					onSubmit={async (ev): Promise<false> => {
						ev.preventDefault();
						setFormState('LOADING');

						try {
							const callbackUrl = undefined; //TODO: check localStorage for redirect url, and if found, clear it

							await signIn('email', {
								callbackUrl,
								email,
							});

							setFormState('SUBMITTED');
						} catch (error) {
							console.error({ error });
							setError(error);
							setFormState('ERRORED');
						}

						return false;
					}}
				>
					{formState === 'ERRORED' && (
						<h1>{'Something went wrong, please try again'}</h1>
					)}
					<input
						autoComplete="email"
						autoFocus
						id="email"
						name="email"
						onChange={(ev: FormEvent<HTMLInputElement>): void =>
							setEmail(ev.currentTarget.value)
						}
						placeholder="Email"
						required
						title="email"
						type="email"
					/>
					<button type="submit" disabled={formState === 'LOADING'}>
						Login
					</button>
				</form>
			) : (
				<>
					<h3>Please check your email to sign in</h3>
					<h5>You may close this window</h5>
				</>
			)}
			<button
				type="button"
				onClick={async (): Promise<void> => await signIn('google')}
			>
				Sign in with Google
			</button>
			<button
				type="button"
				onClick={async (): Promise<void> => await signIn('twitter')}
			>
				Sign in with Twitter
			</button>
		</Unauthenticated>
	);
};

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	const query = gql`
		query GetPoolYear($Name: String!) {
			getSystemValue(Name: $Name) {
				systemValueID
				systemValueName
				systemValueValue
			}
		}
	`;
	const data = await fetcher<{
		getSystemValue: {
			systemValueValue: null | string;
		};
	}>(query, { Name: 'YearUpdated' });

	return { props: { year: data.getSystemValue.systemValueValue } };
};

Login.whyDidYouRender = true;

// ts-prune-ignore-next
export default Login;
