import prisma from '../../../lib/prisma';
import operand from 'lib/operand'

export default async function handler(req, res) {
  const id = req.body.id
  const data = req.body.data
  console.log(`[update] received id: ${id}`)
  const post = await prisma.post.update({
    where: {
      id: id 
    },
    data: data
  })
  operand.updateGroup(post.operandId, {
    kind: "html",
    metadata: {
      html: post.question,
      title: post.answer ? post.answer : post.question,
    }
  })
  res.status(200).json({ id: id })
}