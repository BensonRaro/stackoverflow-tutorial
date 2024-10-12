import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import AddTag from "@/components/navigation/AddTag";
import TagCard from "@/components/TagCard";

const RightSidebar = async () => {
  const user = await currentUser();

  const userTags = await db.tag.findMany({
    where: {
      userId: user?.id,
      questionId: null,
    },
  });

  //   console.log(userTags);
  return (
    <div className="dark:dark-gradient bg-light-800 custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <SignedOut>
        <h2 className="text-neutral-400 text-xl font-semibold mt-4 items-center justify-center flex">
          Sign In to Add Your Tags
        </h2>
      </SignedOut>
      <SignedIn>
        <h1 className="h3-bold text-dark200_light900">Your Tags</h1>
        {/* empty tag */}
        {userTags.length === 0 && (
          <div className="text-neutral-400 mt-2">You have No Tags</div>
        )}
        {/* add tag */}
        <AddTag />
        {/* show tags */}
        <div className="flex flex-col gap-2 mt-2">
          {userTags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag.tag}
              id={tag.id}
              use="RightSidebar"
            />
          ))}
        </div>
      </SignedIn>
    </div>
  );
};

export default RightSidebar;
