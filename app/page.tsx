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
import type { User } from ".prisma/client";
// import { unstable_getServerSession } from "next-auth/next";

// import { authOptions } from "pages/api/auth/[...nextauth]";
// import { useIsDoneRegistering } from "~/hooks/auth";
import Index from "~/old_pages/index";

const Dashboard = async () => {
  console.log("BEFORE");
  // const session =
  // await unstable_getServerSession(authOptions);
  console.log("AFTER");
  // const { /* redirected, */ user } = useIsDoneRegistering(session);

  // if (redirected) {
  //   return <></>;
  // }

  // if (!user) {
  //   return <h1>NO USER!!!</h1>;
  // }

  return <Index user={{} as User} />; // user} />;
};

// ts-prune-ignore-next
export default Dashboard;
