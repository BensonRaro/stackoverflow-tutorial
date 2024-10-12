"use server";

import { answer, downvote, upvote, user } from "@prisma/client";

export async function FetchAnswers(
  filter: string,
  answers:
    | (answer & {
        upvotes: upvote[];
        downvotes: downvote[];
        user: user;
      })[]
    | null
) {
  try {
    let sortedAnswers;

    if (filter === "recent" || filter === "old") {
      return answers;
    } else if (filter === "highestupvotes") {
      sortedAnswers = answers?.sort(
        (a, b) => b.upvotes.length - a.upvotes.length
      );
      return sortedAnswers;
    } else if (filter === "lowestupvotes") {
      sortedAnswers = answers?.sort(
        (a, b) => a.upvotes.length - b.upvotes.length
      );
      return sortedAnswers;
    } else {
      return answers;
    }
  } catch (error) {
    console.log(error);
  }
}
