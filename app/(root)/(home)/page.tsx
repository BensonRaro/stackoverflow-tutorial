import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/global/QuestionCard";
import NoResult from "@/components/global/NoResult";
import Searchbar from "@/components/Searchbar";
import Filters from "@/components/global/Filters";
import { HomePageFilters } from "@/constants/filters";
import MobileFilters from "@/components/global/MobileFilters";
import CustomPagination from "@/components/global/CustomPagination";
import { FetchQuestion } from "@/actions/FetchQuestion";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    page: number;
    filter: string;
    q: string;
  };
}) {
  const CurrentUser = await currentUser();
  const page = searchParams.page ? searchParams.page : 0;

  const question = await db.question.findMany();

  const Questions = await db.question.findMany({
    skip: 10 * Number(page),
    take: 10,
    include: {
      tags: true,
      answer: true,
      downvotes: true,
      saves: true,
      upvotes: true,
      user: true,
    },
    where: {
      title: {
        contains: searchParams.q,
      },
    },
    orderBy: {
      createdAt: searchParams.filter === "newest" ? "desc" : "asc",
    },
  });
  // console.log(Questions);

  const UserTags = await db.tag.findMany({
    where: {
      userId: CurrentUser?.id,
      questionId: null,
    },
  });

  const result = await FetchQuestion(searchParams.filter, UserTags, Questions);

  return (
    <>
      {Questions?.length > 0 && (
        <>
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="h1-bold text-dark100_light900">All Questions</h1>
            <Link
              href={"/askQuestion"}
              className="flex justify-end max-sm:w-full"
            >
              <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                Ask a Question
              </Button>
            </Link>
          </div>
          <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Searchbar
              route="/"
              iconPosition="left"
              imgSrc="/assets/icons/search.svg"
              placeholder="Search for questions"
              otherClasses="flex-1"
            />
            {/* MobileFilters */}
            <MobileFilters
              filters={HomePageFilters}
              otherClasses="min-h-[56px] sm:min-w-[170px]"
              containerClasses="hidden max-md:flex"
            />
          </div>
          <Filters filters={HomePageFilters} />
        </>
      )}
      <div className="mt-10 flex w-full flex-col gap-6">
        {result && result.length > 0 ? (
          <>
            {result?.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                tags={question.tags}
                user={question.user}
                Upvotes={question.upvotes}
                answers={question.answer}
              />
            ))}
            {question?.length > 10 && (
              <div className="mt-10">
                <CustomPagination
                  page={searchParams.page}
                  length={question.length}
                />
              </div>
            )}
          </>
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/askQuestion"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
