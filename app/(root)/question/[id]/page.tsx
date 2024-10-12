import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

import Metric from "@/components/global/Metric";
import TagCard from "@/components/TagCard";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { db } from "@/lib/db";
import Votes from "@/components/global/Votes";
import ParseHTML from "@/components/global/ParseHTML";
import UserAnswer from "@/components/UserAnswer";
import AllAnswers from "@/components/AllAnswers";

const QuestionPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    page: number;
    filter: string;
  };
}) => {
  const ClerkUser = await currentUser();

  const question = await db.question.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tags: true,
      answer: true,
      downvotes: true,
      saves: true,
      upvotes: true,
      user: true,
    },
  });

  if (!question) return null;

  const pageNo = searchParams.page ? searchParams.page : 0;

  const answers = await db.answer.findMany({
    where: {
      questionId: params.id,
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

  // console.log(answers);

  const saved = await db.collection.findMany();
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question?.userId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.user?.imageUrl}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.user.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={question.id}
              userId={ClerkUser?.id}
              upvotes={question.upvotes.length}
              hasupVoted={question.upvotes.some(
                (item) => item.userId === ClerkUser?.id
              )}
              downvotes={question.downvotes.length}
              hasdownVoted={question.downvotes.some(
                (item) => item.userId === ClerkUser?.id
              )}
              saved={saved}
              Downvotes={question.downvotes}
              Upvotes={question.upvotes}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question?.title}
        </h2>
      </div>
      {/* metrics */}
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question?.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question.answer.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      {/* Parse */}
      <ParseHTML explanation={question.explanation} />
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <TagCard key={tag.id} tag={tag.tag} use="Home" id={tag.id} />
        ))}
      </div>
      {/* answers */}
      <AllAnswers
        totalAnswers={question.answer.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
        answers={answers}
      />
      {/* User Answer Section */}
      <UserAnswer id={question.id} />
    </>
  );
};

export default QuestionPage;
