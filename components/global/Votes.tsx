"use client";

import { collection, downvote, upvote } from "@prisma/client";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

import { formatAndDivideNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddToCollection, DeleteCollection } from "@/actions/collection";
import { DeleteDownvote, DownvoteQuestionAnswer } from "@/actions/downvote";
import { DeleteUpvote, UpvoteQuestionAnswer } from "@/actions/upvote";

interface Props {
  type: "answer" | "question";
  itemId: string;
  userId: string | undefined;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  saved?: collection[];
  Downvotes: downvote[];
  Upvotes: upvote[];
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  saved,
  Downvotes,
  Upvotes,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const hasSaved = saved?.some(
    (item) => item.questionId === itemId && item.userId === userId
  );

  const handleSave = () => {
    startTransition(async () => {
      if (!userId) {
        toast.error("You must be logged in to perform this action");
      }
      // TODO: save to db
      if (hasSaved) {
        // TODO: delete from db
        const SavedQuestion = saved?.find(
          (item) => item.questionId === itemId && item.userId === userId
        );
        await DeleteCollection(SavedQuestion?.id);
        toast.success("Question Unsaved");
      } else {
        // TODO: save to db
        await AddToCollection(itemId);
        toast.success("Question Saved");
      }
    });
  };

  const handleVote = (action: "upvote" | "downvote") => {
    startTransition(async () => {
      if (!userId) {
        toast.error("You must be logged in to perform this action");
      }
      // upvote
      if (action === "upvote") {
        if (hasupVoted) {
          const UpvoteResult = Upvotes?.find((item) => item.userId === userId);
          await DeleteUpvote(UpvoteResult?.id);
        } else {
          if (hasdownVoted) {
            const DownvoteResult = Downvotes?.find(
              (item) => item.userId === userId
            );
            await DeleteDownvote(DownvoteResult?.id);

            await UpvoteQuestionAnswer(itemId, type);
          } else {
            await UpvoteQuestionAnswer(itemId, type);
          }
        }
      }
      // downvote
      if (action === "downvote") {
        if (hasdownVoted) {
          const DownvoteResult = Downvotes?.find(
            (item) => item.userId === userId
          );
          await DeleteUpvote(DownvoteResult?.id);
        } else {
          if (hasupVoted) {
            const UpvoteResult = Upvotes?.find(
              (item) => item.userId === userId
            );
            await DeleteUpvote(UpvoteResult?.id);

            await DownvoteQuestionAnswer(itemId, type);
          } else {
            await DownvoteQuestionAnswer(itemId, type);
          }
        }
      }
    });
  };

  return (
    <div className="flex gap-5">
      {/* votes */}
      <div className="flex-center gap-2.5">
        {/* upvotes */}
        <div className="flex-center gap-1.5">
          <Button
            onClick={() => handleVote("upvote")}
            disabled={isPending}
            variant={"ghost"}
          >
            <Image
              src={
                hasupVoted
                  ? "/assets/icons/upvoted.svg"
                  : "/assets/icons/upvote.svg"
              }
              width={18}
              height={18}
              alt="upvote"
              className="cursor-pointer"
            />
          </Button>
          {/* upvotes count */}
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        {/* downvotes */}
        <div className="flex-center gap-1.5">
          <Button
            onClick={() => handleVote("downvote")}
            disabled={isPending}
            variant={"ghost"}
          >
            <Image
              src={
                hasdownVoted
                  ? "/assets/icons/downvoted.svg"
                  : "/assets/icons/downvote.svg"
              }
              width={18}
              height={18}
              alt="downvote"
              className="cursor-pointer"
            />
          </Button>

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {/* collection/saved */}
      {type === "question" && (
        <Button disabled={isPending} onClick={handleSave} variant={"ghost"}>
          <Image
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            width={18}
            height={18}
            alt="star"
            className="cursor-pointer"
          />
        </Button>
      )}
    </div>
  );
};

export default Votes;
