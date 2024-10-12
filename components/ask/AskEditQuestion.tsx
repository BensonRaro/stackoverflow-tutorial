"use client";

import { Editor } from "@tinymce/tinymce-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTransition } from "react";
import { question, tag } from "@prisma/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuestionsSchema } from "@/lib/validation";
import TagInput from "@/components/ask/TagInput";
import { AskQuestion, EditQuestion } from "@/actions/Question";

const AskEditQuestion = ({
  question,
}: {
  question?:
    | (question & {
        tags: tag[];
      })
    | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const tags = question?.tags.map((tag) => ({
    id: tag.id,
    text: tag.tag,
  }));

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: question
      ? {
          title: question.title,
          explanation: question.explanation,
          tags: tags,
        }
      : {
          title: "",
          explanation: "",
          tags: [],
        },
  });

  const onSubmit = (values: z.infer<typeof QuestionsSchema>) => {
    // console.log(values);
    startTransition(async () => {
      if (question) {
        // edit
        await EditQuestion(question.id, values, question.userId)
          .then(() => {
            form.reset();
            router.push("/");
            toast.success("Question edited successfully");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
          });
      } else {
        // create
        await AskQuestion(values)
          .then(() => {
            form.reset();
            router.push("/");
            toast.success("Question created successfully");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
          });
      }
    });
  };

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask Question</h1>
      <div className="mt-9">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Title *
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <Input
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Be specific and imagine you`&apos;`re asking a question to
                    another person.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* explanation */}
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Title *
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                      onBlur={field.onBlur}
                      initialValue={field.value || "Welcome to StackOverflow!"}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        plugins:
                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                        content_style:
                          "body { font-family:Inter; font-size:16px }",
                        skin: resolvedTheme === "dark" ? "oxide-dark" : "oxide",
                        content_css:
                          resolvedTheme === "dark" ? "dark" : "light",
                      }}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Be specific and imagine you`&apos;`re asking a question to
                    another person.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Title *
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <TagInput
                      questionTags={field.value}
                      onChange={(tags) => field.onChange(tags)}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Be specific and imagine you`&apos;`re asking a question to
                    another person.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="primary-gradient w-full !text-light-900"
              disabled={isPending}
            >
              {question ? "Edit Question" : "Ask a Question"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AskEditQuestion;
