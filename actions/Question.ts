"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { QuestionsSchema } from "@/lib/validation";
import { db } from "@/lib/db";

// ask
export async function AskQuestion(values: z.infer<typeof QuestionsSchema>) {
  const user = await currentUser();

  if (!user) return;

  try {
    const question = await db.question.create({
      data: {
        title: values.title,
        explanation: values.explanation,
        userId: user.id,
      },
    });

    const tags = values.tags.map((tag) => ({
      userId: user.id,
      tag: tag.text,
      questionId: question.id,
    }));

    await db.tag.createMany({
      data: tags,
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

// edit

// delete
export async function DeleteQuestion(id: string) {
  const user = await currentUser();

  if (!user) return;
  if (!id) return;

  try {
    await db.question.delete({
      where: {
        id,
        userId: user.id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

export async function EditQuestion(
  id: string,
  values: z.infer<typeof QuestionsSchema>,
  userId: string
) {
  const user = await currentUser();
  if (!id) return;
  if (!user) return;
  if (userId !== user.id) return;

  // update question
  await db.question.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      title: values.title,
      explanation: values.explanation,
    },
  });

  // update tags
  // delete existing tags
  await db.tag.deleteMany({
    where: {
      questionId: id,
    },
  });

  // create new tags
  const tags = values.tags.map((tag) => ({
    userId: user.id,
    tag: tag.text,
    questionId: id,
  }));

  await db.tag.createMany({
    data: tags,
  });

  revalidatePath("/", "layout");
}
