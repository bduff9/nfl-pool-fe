import Cookies from 'js-cookie';
import { gql } from 'graphql-request';
import { GetStaticProps } from 'next';
import { signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, FormEvent, useState } from 'react';
import clsx from 'clsx';

import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';
import { getPageTitle } from '../../utils';
import { formatError } from '../../utils/auth.client';
import { REDIRECT_COOKIE_NAME } from '../../utils/constants';
import { fetcher } from '../../utils/graphql';
import { QueryGetSystemValueArgs } from '../../generated/graphql';
import SocialAuthButton from '../../components/SocialAuthButton/SocialAuthButton';
import styles from '../../styles/Login.module.scss';

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
	const [isLogin, setIsLogin] = useState<boolean>(true);
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
			<div className="content-bg position-absolute top-50 start-50 translate-middle border border-dark rounded-3 p-4 pt-5 col col-sm-10 col-md-6 col-lg-4">
				<div className={styles.football}>
					<Image
						alt="A football icon"
						layout="fill"
						objectFit="contain"
						objectPosition="center center"
						priority
						src="/football.svg"
					/>
				</div>
				<h1 className="text-center lh-1 text-dark">
					{year}
					<br />
					NFL Confidence Pool
				</h1>
				{formState !== 'SUBMITTED' ? (
					<>
						<form
							onSubmit={async (ev): Promise<false> => {
								ev.preventDefault();
								setFormState('LOADING');

								const callbackUrl = readAndDeleteCookie(REDIRECT_COOKIE_NAME);
								const signInResult = await signIn('email', {
									callbackUrl,
									email,
									redirect: false,
								});
								const signInError = signInResult?.error;
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
							{!!errorMessage && (
								<div
									className={clsx('text-center', 'mb-3', styles.error)}
									id="errorMessage"
								>
									{errorMessage}
								</div>
							)}
							<div className="form-floating mb-2">
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
									placeholder="name@example.com"
									required
									title="Email Address"
									type="email"
								/>
								<label htmlFor="email">Email address</label>
							</div>
							<div className="d-grid gap-2 mb-2">
								<button
									className="btn btn-primary"
									type="submit"
									disabled={formState !== 'READY'}
								>
									{isLogin
										? formState === 'LOADING'
											? 'Logging in...'
											: 'Login'
										: formState === 'LOADING'
											? 'Registering...'
											: 'Register'}
								</button>
								<Link href="/support#loginregistration">
									<a className="btn btn-secondary text-white" type="button">
										{isLogin ? 'Trouble logging in?' : 'Trouble registering?'}
									</a>
								</Link>
								<div className={styles.separator}>or</div>
							</div>
						</form>
						<div className="d-grid gap-2 d-md-flex mb-2">
							<SocialAuthButton isRegister={!isLogin} isSignIn type="Google" />
							<SocialAuthButton isRegister={!isLogin} isSignIn type="Twitter" />
						</div>
						<div className="d-grid gap-2">
							<div className={styles.separator}>
								{isLogin ? 'Need to sign up?' : 'Already registered?'}
							</div>
							<button
								className="btn btn-dark"
								onClick={(): void => setIsLogin(isLogin => !isLogin)}
							>
								{isLogin ? 'Register here' : 'Login here'}
							</button>
						</div>
					</>
				) : (
					<>
						<h2 className="text-center text-success my-5">
							Please check your email to sign in
						</h2>
						<h4 className="text-center text-dark mb-4">
							You may close this window
						</h4>
					</>
				)}
			</div>
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
