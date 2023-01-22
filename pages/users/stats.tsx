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
import type { GetServerSideProps } from "next";
import type { FC } from "react";
import React from "react";

import Authenticated from "../../components/Authenticated/Authenticated";
import CustomHead from "../../components/CustomHead/CustomHead";
import {
  isSignedInSSR,
  UNAUTHENTICATED_REDIRECT,
  isDoneRegisteringSSR,
  IS_NOT_DONE_REGISTERING_REDIRECT,
} from "../../utils/auth.server";

const Statistics: FC = () => {
  return (
    <Authenticated isRegistered>
      <CustomHead title="Pool Stats" />
      <h1>Statistics</h1>
    </Authenticated>
  );
};

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
  const session = await isSignedInSSR(context);

  if (!session) {
    return UNAUTHENTICATED_REDIRECT;
  }

  const isDoneRegistering = isDoneRegisteringSSR(session);

  if (!isDoneRegistering) {
    return IS_NOT_DONE_REGISTERING_REDIRECT;
  }

  const { user } = session;

  return { props: { user } };
};

// ts-prune-ignore-next
export default Statistics;
