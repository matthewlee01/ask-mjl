import prisma from "../../../lib/prisma";

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
  res.status(200).json({ post: post });
}
