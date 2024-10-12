import { FetchQuestion } from "@/actions/FetchQuestion";
import { db } from "@/lib/db";
import Searchbar from "@/components/Searchbar";
import MobileFilters from "@/components/global/MobileFilters";
import { HomePageFilters } from "@/constants/filters";
import Filters from "@/components/global/Filters";
import QuestionCard from "@/components/global/QuestionCard";
import NoResult from "@/components/global/NoResult";
import CustomPagination from "@/components/global/CustomPagination";

interface Props {
  userId: string;
  clerkId?: string | null;
  searchParams: {
    page: number;
    filter: string;
    q: string;
  };
}

const QuestionTab = async ({ searchParams, userId }: Props) => {
  const questions = await db.question.findMany();

  const pageNo = searchParams.page ? searchParams.page : 0;

  const Question = await db.question.findMany({
    skip: 10 * Number(pageNo),
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
      userId: userId,
    },
    orderBy: {
      createdAt: searchParams.filter === "newest" ? "desc" : "asc",
    },
  });

  const Tags = await db.tag.findMany({
    where: {
      userId: userId,
      questionId: null,
    },
  });

  const result = await FetchQuestion(searchParams.filter, Tags, Question);
  return (
    <>
      {Question.length > 0 && (
        <>
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
        {result?.length! > 0 ? (
          <>
            {result?.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answers={question.answer}
                user={question.user}
                tags={question.tags}
                Upvotes={question.upvotes}
              />
            ))}
            {Question?.length > 10 && (
              <div className="mt-10">
                <CustomPagination
                  page={searchParams.page}
                  length={questions.length}
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
};

export default QuestionTab;
