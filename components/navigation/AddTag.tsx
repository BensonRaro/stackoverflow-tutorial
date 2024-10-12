"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { MdAddTask } from "react-icons/md";
import { useUser } from "@clerk/nextjs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateTag } from "@/actions/Tag";

const AddTag = () => {
  const { user } = useUser();

  const [tag, setTag] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!tag) return;
    startTransition(async () => {
      await CreateTag(tag)
        .then(() => {
          toast.success("Tag added successfully");
          setTag("");
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
        });
    });
  };

  const clearInput = () => {
    setTag("");
  };
  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full flex items-center shadow-lg mt-2"
    >
      <Input
        value={tag}
        disabled={isPending || !user}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Add Tag"
        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
      {tag && (
        <X
          className="absolute top-2.5 right-14 size-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
          onClick={clearInput}
        />
      )}
      <Button
        disabled={isPending || !user}
        type="submit"
        variant={"secondary"}
        className="rounded-l-none"
      >
        <MdAddTask className="size-5 text-muted-foreground" />
      </Button>
    </form>
  );
};

export default AddTag;
