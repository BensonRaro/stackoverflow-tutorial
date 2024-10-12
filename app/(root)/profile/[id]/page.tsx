import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import { db } from "@/lib/db";
import ProfileLink from "@/components/ProfileLink";
import { currentUser } from "@clerk/nextjs/server";
import QuestionTab from "@/components/QuestionTab";
import AllAnswers from "@/components/AllAnswers";

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    page: number;
    filter: string;
    q: string;
  };
}) => {
  const ClerkUser = await currentUser();

  const user = await db.user.findUnique({
    where: {
      userId: params.id,
    },
    include: {
      answer: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  const pageNo = searchParams.page ? searchParams.page : 0;

  const answers = await db.answer.findMany({
    where: {
      userId: params.id,
    },
    skip: 10 * Number(pageNo),
    take: 10,
    include: {
      downvotes: true,
      upvotes: true,
      user: true,
    },
    orderBy: {
      createdAt:
        searchParams.filter === "recent"
          ? "desc"
          : searchParams.filter === "old"
          ? "asc"
          : "desc",
    },
  });
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={user.imageUrl}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user?.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user?.userName}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfolioWebsite && (
                <ProfileLink
                  href={user.portfolioWebsite}
                  imgUrl="/assets/icons/link.svg"
                  title="Portfolio"
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(user?.createdAt)}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark200_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {ClerkUser?.id === user?.userId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <div className="mt-11 flex gap-10">
        <Tabs defaultValue="questions" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="questions" className="tab">
              Questions
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="questions"
            className="flex w-full flex-col gap-6 mt-5"
          >
            <QuestionTab searchParams={searchParams} userId={user.userId} />
          </TabsContent>
          <TabsContent
            value="answers"
            className="flex w-full flex-col gap-6 mt-5"
          >
            <AllAnswers
              totalAnswers={user.answer.length}
              page={searchParams?.page}
              filter={searchParams?.filter}
              answers={answers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
