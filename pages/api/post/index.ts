import operand from 'lib/operand';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  var posts = await prisma.post.findMany();
  for (let i = 0; i < posts.length; i++) {
    if (!posts[i].operandId) {
      const group = await operand.createGroup(process.env.OPERAND_COLLECTION_ID, {
        kind: "html",
        metadata: {
          html: posts[i].answer ? posts[i].answer : posts[i].question,
          title: posts[i].question
        }
      })
      await prisma.post.update({
        where: {
          id: posts[i].id
        },
        data: {
          operandId: group.id
        }
      })
      posts[i].operandId = group.id
    }
  }
  res.status(200).json({ list: posts })
}