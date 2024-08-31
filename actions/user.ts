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
export async function createUser(values: user, userId: string) {
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
export async function updateUser(values: user, use: "webhook" | "userUpdate") {
  const CurrentUser = await currentUser();
  if (!CurrentUser) return;

  try {
    if (use === "webhook") {
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
      } catch (error) {
        console.log(error);
      }
    }
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
export async function DeleteUser(userId: string) {
  try {
    await db.user.delete({
      where: {
        userId: userId,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}
