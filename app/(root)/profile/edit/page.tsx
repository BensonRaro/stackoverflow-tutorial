import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Profile from "@/components/Profile";

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/");
  }

  const user = await db.user.findUnique({ where: { userId: clerkUser?.id } });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile user={user} />
      </div>
    </>
  );
};

export default Page;
