"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

// add to collection
export async function AddToCollection(id: string) {
  const user = await currentUser();
  if (!user) return;
  try {
    await db.collection.create({
      data: {
        userId: user?.id || "",
        questionId: id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

// delete collection
export async function DeleteCollection(id: string | undefined) {
  const user = await currentUser();
  if (!user) return;
  if (!id) return;
  try {
    await db.collection.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
