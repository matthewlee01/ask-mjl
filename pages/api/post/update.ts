import prisma from "../../../lib/prisma";
import operand from "lib/operand";

export default async function handler(req, res) {
  const id = req.body.id;
  const data = req.body.data;
  console.log(`[update] received id: ${id}`);
  const post = await prisma.post.update({
    where: {
      id: id,
    },
    data: data,
  });
  if (post.operandId) {
    console.log(`[operand] updating group: ${post.operandId}`);
    operand.updateGroup(post.operandId, {
      kind: "html",
      metadata: {
        title: post.question,
        html: post.answer ? post.answer : post.question,
      },
    });
  } else {
    const group = await operand.createGroup({
      kind: "html",
      collectionId: process.env.OPERAND_COLLECTION_ID,
      metadata: {
        title: post.question,
        html: post.answer,
      },
      properties: {},
    });
    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        operandId: group.id,
      },
    });
    console.log(`[operand] created group: ${group.id}`);
  }
  res.status(200).json({ id: id });
}
