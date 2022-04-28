import prisma from "../../../lib/prisma";
import operand from "lib/operand";

export default async function handler(req, res) {
  const { pid } = req.query;
  var post = await prisma.post.findFirst({
    where: {
      OR: [
        {
          question: pid,
        },
        {
          question: pid + "?",
        },
      ],
    },
  });
  let related = null;
  if (post) {
    related = (await operand.related(
      post.operandId,
      [process.env.OPERAND_COLLECTION_ID],
      8
    )).groups.map((group) => {
      return {
        question: group.metadata.title,
        answer: group.metadata.html,
        score: group.score,
      }
    })
  }
  res.status(200).json({ post: post, related: related });
}
