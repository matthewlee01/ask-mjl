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
    await operand.deleteObject({
      id: post.operandId
    });
    const object = await operand.createObject({
      parentId: process.env.OPERAND_COLLECTION_ID, 
      type: "html",
      metadata: {
        title: post.question,
        html: post.answer ? post.answer : post.question,
      },
    });
    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        operandId: object.id,
      },
    });
  } else {
    const group = await operand.createObject({
      type: "html",
      parentId: process.env.OPERAND_COLLECTION_ID,
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
