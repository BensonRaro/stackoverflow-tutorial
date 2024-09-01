import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { createUser, DeleteUser, updateUser } from "@/actions/user";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const eventType = evt.type;

  // Create a new user in your database
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    const user = await createUser(
      {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        userName: username!,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        bio: "",
        portfolioWebsite: "",
      },
      id
    );
    return NextResponse.json({ message: "OK", user: user });
  }

  // update user in your database
  if (eventType === "user.updated") {
    const { email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    const values = {
      name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
      userName: username!,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
      bio: "",
      portfolioWebsite: "",
    };

    const User = await updateUser(values, "webhook");

    return NextResponse.json({ message: "OK", user: User });
  }

  // delete user from your database
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    const deletedUser = await DeleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
