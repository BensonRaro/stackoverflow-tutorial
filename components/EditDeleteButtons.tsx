"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { DeleteQuestion } from "@/actions/Question";
import { Button } from "@/components/ui/button";
import { DeleteAnswer } from "@/actions/answer";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteButtons = ({ type, itemId }: Props) => {
  const router = useRouter();
  const [pending, startTranstion] = useTransition();

  const handleEdit = () => {
    router.push(`/askQuestion/${itemId}`);
  };

  const handleDelete = async () => {
    startTranstion(async () => {
      if (type === "Question") {
        // Delete question
        await DeleteQuestion(itemId);
      } else if (type === "Answer") {
        // Delete answer
        await DeleteAnswer(itemId);
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1 max-sm:w-full">
      {type === "Question" && (
        <Button size={"icon"} variant={"ghost"} onClick={handleEdit}>
          <Image
            src="/assets/icons/edit.svg"
            alt="Edit"
            width={20}
            height={20}
            className="cursor-pointer object-contain"
          />
        </Button>
      )}

      <Button
        size={"icon"}
        variant={"ghost"}
        disabled={pending}
        onClick={handleDelete}
      >
        <Image
          src="/assets/icons/trash.svg"
          alt="Delete"
          width={20}
          height={20}
          className="cursor-pointer object-contain"
        />
      </Button>
    </div>
  );
};

export default EditDeleteButtons;
