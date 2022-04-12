import operand from 'lib/operand';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const id = req.body.id
  console.log(`[delete] received id: ${id}`)
  const post = await prisma.post.findUnique({
    where: {
      id: id
    }
  });
  if (post) {
    if (post.operandId) {
      await operand.deleteGroup(post.operandId);
    }
    await prisma.post.delete({
      where: {
        id: id 
      }
    })
  }
  res.status(200).json({ id: id })
}