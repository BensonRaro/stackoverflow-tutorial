"use server";

import {
  answer,
  downvote,
  question,
  collection,
  tag,
  upvote,
  user,
} from "@prisma/client";

export async function FetchQuestion(
  filter: string,
  userTags: tag[],
  Question:
    | (question & {
        tags: tag[];
        upvotes: upvote[];
        saves: collection[];
        downvotes: downvote[];
        answer: answer[];
        user: user;
      })[]
    | null
) {
  try {
    let sortedQuestions;

    const userTagsNames = userTags.map((tag) => tag.tag);

    const enhencedQuestions = Question?.map((question) => {
      const Results = {
        ...question,
        hasUserTags: question.tags.some((tag) =>
          userTagsNames.includes(tag.tag)
        ),
      };

      return Results;
    });

    if (filter === "upvotes") {
      sortedQuestions = enhencedQuestions?.sort(
        (a, b) => b.upvotes.length - a.upvotes.length
      );
    } else if (filter === "recommended" || !filter) {
      sortedQuestions = enhencedQuestions?.sort((a, b) => {
        if (a.hasUserTags && !b.hasUserTags) {
          return -1;
        }

        if (!a.hasUserTags && b.hasUserTags) {
          return 1;
        }

        return 0;
      });
    } else if (filter === "unanswered") {
      sortedQuestions = enhencedQuestions?.sort(
        (a, b) => a.answer.length - b.answer.length
      );
    } else {
      return Question;
    }

    if (filter === "newest") {
      return Question;
    } else {
      return sortedQuestions;
    }
  } catch (error) {
    console.log(error);
  }
}
