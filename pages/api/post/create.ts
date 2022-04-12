import operand from 'lib/operand';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const question = req.body.question
  console.log(`received question: ${question}`)
  const group = await operand.createGroup(process.env.OPERAND_COLLECTION_ID, {
    kind: "html",
    metadata: {
      html: question,
      title: question,
    }
  })
  await prisma.post.create({
    data: {
      operandId: group.id,
      question: question
    }
  })
  res.status(200).json({ question: question })
}