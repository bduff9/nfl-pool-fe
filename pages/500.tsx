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
import { promises as fs } from "fs";
import path from "path";

import clsx from "clsx";
import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import React, { useMemo } from "react";
import { useSession } from "next-auth/react";

import styles from "../styles/500.module.scss";
import CustomHead from "../components/CustomHead/CustomHead";

type ErrorProps = {
  images: string[];
};

const Error: FC<ErrorProps> = ({ images }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const image = useMemo<string>(
    () => images[Math.floor(Math.random() * images.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath],
  );

  return (
    <div className="row">
      <CustomHead title="Error Occurred" />
      <div className="content-bg position-absolute top-50 start-50 translate-middle border border-dark rounded-3 text-dark pb-4 col-md-6">
        <h1 className="text-center">Flag on the play!</h1>
        <div className={clsx("mx-auto", "position-relative", styles["image-500"])}>
          <Image
            alt="Flag on the play"
            src={image}
            fill
            sizes="100vw"
            style={{
              objectFit: "contain",
              objectPosition: "center center",
            }}
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
              <Link href="/" className="bare-link">
                Click here to return to your dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="bare-link">
                Click here to return to the login page
              </Link>
            )}
          </h2>
        )}
      </div>
    </div>
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
  const imagesDirectory = path.join(process.cwd(), "public", "500");
  const imageNames = await fs.readdir(imagesDirectory);
  const images = imageNames.map(image => `/500/${image}`);

  return { props: { images } };
};

// ts-prune-ignore-next
export default Error;
