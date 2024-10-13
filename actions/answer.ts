"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

// create tag
export async function AddAnswer(id: string, answer: string) {
  const user = await currentUser();
  if (!user) return;
  if (!id) return;
  try {
    await db.answer.create({
      data: {
        questionId: id,
        answer: answer,
        userId: user.id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

export async function DeleteAnswer(id: string) {
  const user = await currentUser();
  if (!user) return;
  if (!id) return;
  try {
    await db.answer.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
