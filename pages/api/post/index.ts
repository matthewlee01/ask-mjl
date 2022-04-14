import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  var posts = await prisma.post.findMany();
  res.status(200).json({ list: posts })
}