"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

// create downvote
export async function UpvoteQuestionAnswer(
  id: string,
  type: "answer" | "question"
) {
  const user = await currentUser();
  if (!user) return;
  if (!id) return;
  try {
    if (type === "question") {
      await db.upvote.create({
        data: {
          questionId: id,
          userId: user?.id || "",
        },
      });
    } else {
      await db.upvote.create({
        data: {
          answerId: id,
          userId: user?.id || "",
        },
      });
    }
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

// delete downvote
export async function DeleteUpvote(id: string | undefined) {
  const user = await currentUser();
  if (!user) return;
  if (!id) return;
  try {
    await db.upvote.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
