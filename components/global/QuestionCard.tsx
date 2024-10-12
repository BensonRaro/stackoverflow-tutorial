"use client";

import Link from "next/link";
import Moment from "react-moment";
import { useUser } from "@clerk/nextjs";
import { answer, question, tag, upvote, user } from "@prisma/client";

import TagCard from "@/components/TagCard";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import EditDeleteButtons from "@/components/EditDeleteButtons";
import Metric from "@/components/global/Metric";

const QuestionCard = ({
  question,
  user,
  tags,
  answers,
  Upvotes,
}: {
  question: question;
  user: user | null;
  tags: tag[];
  answers: answer[];
  Upvotes: upvote[];
}) => {
  const { user: ClerkUser } = useUser();

  const isAuthor = ClerkUser?.id === user?.userId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {/* <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            <Moment fromNow>{question.createdAt}</Moment>
          </span> */}
          <Link href={`/question/${question.id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
        {isAuthor && <EditDeleteButtons type="Question" itemId={question.id} />}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag.id} id={tag.id} tag={tag.tag} use="Home" />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={user?.imageUrl}
          alt="user"
          value={user?.name}
          title={` - asked ${getTimestamp(question.createdAt)}`}
          href={`/profile/${user?.id}`}
          isAuthor={isAuthor}
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(Upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
