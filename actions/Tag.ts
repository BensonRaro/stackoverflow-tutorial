"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

// create tag
export async function CreateTag(tag: string) {
  const user = await currentUser();
  try {
    await db.tag.create({
      data: {
        tag: tag,
        userId: user?.id || "",
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

// delete tag
export async function DeleteTag(id: string | undefined) {
  const user = await currentUser();

  if (!user) return;
  try {
    await db.tag.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
