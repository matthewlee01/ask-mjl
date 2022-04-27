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
      5
    )).groups.map((group) => {
      return {
        ...group.metadata,
        score: group.score,
      }
    })
    console.log(related);
  }
  res.status(200).json({ post: post, related: related });
}
