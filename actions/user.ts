"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

interface user {
  name: string;
  userName: string;
  imageUrl?: string;
  email?: string;
  bio: string | null;
  portfolioWebsite: string | null;
}

// create user
export async function CreateUser(values: user, userId: string) {
  if (!userId) return;
  try {
    await db.user.create({
      data: {
        userId: userId,
        name: values.name,
        userName: values.userName,
        imageUrl: values.imageUrl || "",
        email: values.email || "",
        bio: values.bio,
        portfolioWebsite: values.portfolioWebsite,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

// update user
export async function UpdateUser(values: user, use: "webhook" | "userUpdate") {
  const CurrentUser = await currentUser();

  if (!CurrentUser) return;

  if (use === "webhook") {
    try {
      await db.user.update({
        where: {
          userId: CurrentUser.id,
        },
        data: {
          name: values.name,
          userName: values.userName,
          imageUrl: values.imageUrl || "",
          email: values.email || "",
        },
      });
      revalidatePath("/", "layout");
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      await db.user.update({
        where: {
          userId: CurrentUser.id,
        },
        data: {
          name: values.name,
          userName: values.userName,
          bio: values.bio,
          portfolioWebsite: values.portfolioWebsite,
        },
      });
      revalidatePath("/", "layout");
    } catch (error) {
      console.log(error);
    }
  }
}

// delete user
export async function DeleteUser(userId: string) {
  try {
    await db.user.delete({
      where: {
        userId,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
