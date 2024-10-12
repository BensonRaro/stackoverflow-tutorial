"use client";

import { X } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteTag } from "@/actions/Tag";

const TagCard = ({
  tag,
  use,
  id,
}: {
  tag: string | null;
  use: "Home" | "RightSidebar" | "QDetails";
  id?: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      await DeleteTag(id)
        .then(() => {
          toast.success("Tag Deleted");
        })
        .catch((error) => {
          toast.error("Error deleting tag");
          console.log(error);
        });
    });
  };

  return (
    <div className="flex justify-between gap-2">
      <Badge className="bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300 rounded-md border-none px-4 py-2 text-base font-semibold">
        {tag}
      </Badge>
      {use === "RightSidebar" && (
        <Button
          type="button"
          variant={"ghost"}
          className="p-1"
          size={"icon"}
          disabled={isPending}
          onClick={onDelete}
        >
          <X className="size-5 text-muted-foreground cursor-pointer hover:opacity-75 transition" />
        </Button>
      )}
    </div>
  );
};

export default TagCard;
