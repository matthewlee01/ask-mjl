import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const id = req.body.id
  console.log(`[delete] received id: ${id}`)
  await prisma.post.delete({
    where: {
      id: id 
    }
  })
  res.status(200).json({ id: id })
}