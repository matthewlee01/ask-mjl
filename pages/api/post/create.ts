import operand from "lib/operand";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { question, email } = req.body;
  console.log(`[create] received question: ${question}`);
  if (email != "") console.log(`[create] submitted by: ${email}`);
  await prisma.post.create({
    data: {
      question: question,
      askerEmail: email == "" ? null : email,
    },
  });
  res.status(200).json({ question: question });
}
