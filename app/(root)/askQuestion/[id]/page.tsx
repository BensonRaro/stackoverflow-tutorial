import AskQuestionAddEdit from "@/components/ask/AskEditQuestion";
import { db } from "@/lib/db";

const EditQuestionPage = async ({ params }: { params: { id: string } }) => {
  const question = await db.question.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tags: true,
    },
  });
  //   console.log(question);
  return <AskQuestionAddEdit question={question} />;
};

export default EditQuestionPage;
