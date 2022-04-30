import prisma from "../../../lib/prisma";

const unansweredResponse: string =
  "<p>this question has already been asked!</p>" +
  "<p>check back later to see if it's been answered : )";

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
  if (post && (post.answer == null || post.answer == "")) {
    post.answer = unansweredResponse; 
  }
  res.status(200).json({ post: post });
}
