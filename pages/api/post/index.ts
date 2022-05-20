import prisma from "../../../lib/prisma";
import operand from "lib/operand";

export default async function handler(req, res) {
  var posts = await prisma.post.findMany();
  posts.map(async (post) => {
    if (!post.operandId) {
      const group = await operand.createGroup({
        collectionId: process.env.OPERAND_COLLECTION_ID,
        kind: "html",
        metadata: {
          title: post.question,
          html: post.answer,
        },
        properties: {},
      });
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          operandId: group.id,
        },
      });

      console.log(`[operand] created group: ${group.id}`);
    }
    console.log(`[posts] serving all ${posts.length} items`);
  });
  res.status(200).json({ list: posts });
}
