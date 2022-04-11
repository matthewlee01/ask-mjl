import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const id = req.body.id
  const data = req.body.data
  console.log(`[update] received id: ${id}`)
  await prisma.post.update({
    where: {
      id: id 
    },
    data: data
  })
  res.status(200).json({ id: id })
}