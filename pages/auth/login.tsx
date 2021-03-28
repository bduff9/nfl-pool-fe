import Cookies from 'js-cookie';
import { gql } from 'graphql-request';
import { GetStaticProps } from 'next';
import { signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, FormEvent, useState } from 'react';

import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { getPageTitle } from '../../utils';
import { formatError } from '../../utils/auth.client';
import { REDIRECT_COOKIE_NAME } from '../../utils/constants';
import { fetcher } from '../../utils/graphql';
import { QueryGetSystemValueArgs } from '../../generated/graphql';

type TFormState = 'READY' | 'LOADING' | 'ERRORED' | 'SUBMITTED';
type LoginProps = { year: string };

const readAndDeleteCookie = (name: string): string => {
	const value = Cookies.get(name);

	if (value) {
		Cookies.set(name, '', { expires: new Date(0) });
	}

	return value || '';
};

const Login: FC<LoginProps> = ({ year }) => {
	const router = useRouter();
	const [session] = useSession();
	const [email, setEmail] = useState<string>('');
	const error =
		typeof window !== 'undefined'
			? new URLSearchParams(window.location.search).get('error')
			: router.query.error;
	const [errorMessage, setErrorMessage] = useState<string>(formatError(error));
	const [formState, setFormState] = useState<TFormState>('READY');

	if (session) {
		router.replace('/');

		return <></>;
	}

	return (
		<Unauthenticated>
			<Head>
				<title>{getPageTitle('Login')}</title>
			</Head>
			<h1>Login ({year})</h1>
			{formState !== 'SUBMITTED' ? (
				<>
					<form
						onSubmit={async (ev): Promise<false> => {
							ev.preventDefault();
							setFormState('LOADING');

							const callbackUrl = readAndDeleteCookie(REDIRECT_COOKIE_NAME);

							console.log({ callbackUrl });
							const { error: signInError } = await signIn('email', {
								callbackUrl,
								email,
								redirect: false,
							});
							const formattedError = formatError(signInError);

							setErrorMessage(formattedError);

							if (formattedError) {
								setFormState('ERRORED');
							} else {
								setFormState('SUBMITTED');
							}

							return false;
						}}
					>
						{!!errorMessage && <h1>{errorMessage}</h1>}
						<input
							autoComplete="email"
							autoFocus
							className="form-control"
							id="email"
							name="email"
							onChange={(ev: FormEvent<HTMLInputElement>): void => {
								setEmail(ev.currentTarget.value);

								if (formState === 'ERRORED') setFormState('READY');
							}}
							placeholder="Email"
							required
							title="email"
							type="email"
						/>
						<button
							className="btn btn-primary"
							type="submit"
							disabled={formState !== 'READY'}
						>
							Login
						</button>
					</form>
					<button
						className="btn btn-danger"
						onClick={async (): Promise<void> => await signIn('google')}
					>
						Sign in with Google
					</button>
					<button
						className="btn btn-info"
						onClick={async (): Promise<void> => await signIn('twitter')}
					>
						Sign in with Twitter
					</button>
				</>
			) : (
				<>
					<h3>Please check your email to sign in</h3>
					<h5>You may close this window</h5>
				</>
			)}
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
	const data = await fetcher<
		{
			getSystemValue: {
				systemValueID: number;
				systemValueName: string;
				systemValueValue: null | string;
			};
		},
		QueryGetSystemValueArgs
	>(query, { Name: 'YearUpdated' });

	return { props: { year: data.getSystemValue.systemValueValue } };
};

Login.whyDidYouRender = true;

// ts-prune-ignore-next
export default Login;
