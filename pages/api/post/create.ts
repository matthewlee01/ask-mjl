import operand from 'lib/operand';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const question = req.body.question
  console.log(`[create] received question: ${question}`)
  await prisma.post.create({
    data: {
      question: question
    }
  })
  res.status(200).json({ question: question })
}