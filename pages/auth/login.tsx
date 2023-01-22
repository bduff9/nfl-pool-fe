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
import Cookies from "js-cookie";
import type { GetStaticPaths, GetStaticProps } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, FormEvent } from "react";
import React, { useState } from "react";
import clsx from "clsx";

import Unauthenticated from "../../components/Unauthenticated/Unauthenticated";
import { formatError } from "../../utils/auth.client";
import { REDIRECT_COOKIE_NAME } from "../../utils/constants";
import SocialAuthButton from "../../components/SocialAuthButton/SocialAuthButton";
// eslint-disable-next-line import/no-unresolved
import styles from "../../styles/Login.module.scss";
import { getLoginValues } from "../../graphql/login";
import CustomHead from "../../components/CustomHead/CustomHead";

type TFormState = "READY" | "LOADING" | "ERRORED" | "SUBMITTED";

const readAndDeleteCookie = (name: string): string => {
  const value = Cookies.get(name);

  if (value) {
    Cookies.set(name, "", { expires: new Date(0) });
  }

  return value || "";
};

type LoginProps = { year: string };

const Login: FC<LoginProps> = ({ year }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const error =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("error")
      : router.query.error;
  const [errorMessage, setErrorMessage] = useState<string>(formatError(error));
  const [formState, setFormState] = useState<TFormState>("READY");

  if (session) {
    router.replace("/");

    return <></>;
  }

  return (
    <Unauthenticated>
      <CustomHead title="Login" />
      <div className="content-bg position-absolute top-50 start-50 translate-middle border border-dark rounded-3 p-4 pt-5 col col-sm-10 col-md-6 col-lg-4">
        <div className={styles.football}>
          <Image
            alt="A football icon"
            priority
            src="/football.svg"
            fill
            sizes="100vw"
            style={{
              objectFit: "contain",
              objectPosition: "center center",
            }}
          />
        </div>
        <h1 className="text-center lh-1 text-dark">
          {year}
          <br />
          NFL Confidence Pool
        </h1>
        {formState !== "SUBMITTED" ? (
          <>
            <form
              onSubmit={async (ev): Promise<false> => {
                ev.preventDefault();
                setFormState("LOADING");

                const callbackUrl = readAndDeleteCookie(REDIRECT_COOKIE_NAME);
                const signInResult = await signIn("email", {
                  callbackUrl,
                  email,
                  redirect: false,
                });
                const signInError = signInResult?.error;
                const formattedError = formatError(signInError);

                setErrorMessage(formattedError);

                if (formattedError) {
                  setFormState("ERRORED");
                } else {
                  setFormState("SUBMITTED");
                }

                return false;
              }}
            >
              {!!errorMessage && (
                <div
                  className={clsx("text-center", "mb-3", styles.error)}
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

                    if (formState === "ERRORED") setFormState("READY");
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
                  disabled={formState !== "READY"}
                >
                  {isLogin
                    ? formState === "LOADING"
                      ? "Logging in..."
                      : "Login"
                    : formState === "LOADING"
                    ? "Registering..."
                    : "Register"}
                </button>
                <Link
                  href="/support#loginregistration"
                  className="btn btn-secondary text-white"
                >
                  {isLogin ? "Trouble logging in?" : "Trouble registering?"}
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
                {isLogin ? "Need to sign up?" : "Already registered?"}
              </div>
              <button
                className="btn btn-dark"
                onClick={(): void => setIsLogin(isLogin => !isLogin)}
              >
                {isLogin ? "Register here" : "Login here"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-center text-success my-5">
              Please check your email to sign in
            </h2>
            <h4 className="text-center text-dark mb-4">You may close this window</h4>
          </>
        )}
      </div>
    </Unauthenticated>
  );
};

// ts-prune-ignore-next
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
  const { getSystemValue } = await getLoginValues();

  return { props: { year: getSystemValue.systemValueValue } };
};

// ts-prune-ignore-next
export default Login;
