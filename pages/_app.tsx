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
import { useAnalytics } from "@happykit/analytics";
// import { AnimateSharedLayout } from "framer-motion";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import type { FC } from "react";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";

import Layout from "../components/Layout/Layout";
import { InfoIcon } from "../components/ToastUtils/ToastIcons";
import { NEXT_PUBLIC_HAPPYKIT_ANALYTICS_KEY } from "../utils/constants";
import {
  useOfflineNotifications,
  useRouteChangeLoader,
  useServiceWorker,
} from "../utils/hooks";

import "../styles/globals.scss";
// Keep selectors for #nprogress, .bar, .peg, .spinner, & .spinner-icon
import "nprogress/nprogress.css";

type SentryProps = { err: unknown };

const App: FC<AppProps & SentryProps> = ({ Component, err, pageProps }) => {
  if (!NEXT_PUBLIC_HAPPYKIT_ANALYTICS_KEY) {
    throw Error("Missing happykit analytics key from env!");
  }

  useAnalytics({ publicKey: NEXT_PUBLIC_HAPPYKIT_ANALYTICS_KEY });
  useServiceWorker();
  useRouteChangeLoader();
  useOfflineNotifications();

  const [, setSlowQuery] = useState<Array<string>>([]);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <SWRConfig
        value={{
          dedupingInterval: 30000,
          focusThrottleInterval: 30000,
          loadingTimeout: 2000,
          onLoadingSlow: key => {
            toast.info("Hmm, this seems to be taking longer than normal", {
              autoClose: false,
              icon: InfoIcon,
              position: "bottom-right",
              toastId: "slow-loading-toast",
            });
            setSlowQuery(list => [...list, key]);
          },
          onSuccess: (_, key) => {
            setSlowQuery(list => {
              const newList = list.filter(item => item !== key);

              if (newList.length === 0) {
                toast.dismiss("slow-loading-toast");
              }

              return newList;
            });
          },
          onError: (_, key) => {
            setSlowQuery(list => {
              const newList = list.filter(item => item !== key);

              if (newList.length === 0) {
                toast.dismiss("slow-loading-toast");
              }

              return newList;
            });
          },
        }}
      >
        {/* <AnimateSharedLayout> */}
        <Layout>
          <Component {...pageProps} err={err} />
        </Layout>
        {/* </AnimateSharedLayout> */}
      </SWRConfig>
      <ToastContainer theme="dark" />
    </SessionProvider>
  );
};

// ts-prune-ignore-next
export default App;
