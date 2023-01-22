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
