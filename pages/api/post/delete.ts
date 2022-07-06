import operand from "lib/operand";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const apiKey = req.headers["authorization"].split(" ")[1];
  if (apiKey != process.env.API_KEY) {
    res.status(401);
  } else {
    const id = req.body.id;
    console.log(`[delete] received id: ${id}`);
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (post) {
      if (post.operandId) {
        await operand.deleteObject({id: post.operandId});
        console.log(`[operand] deleted group: ${post.operandId}`);
      }
      await prisma.post.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({ id: id });
    } else {
      res.status(404);
    }
  }
  res.end();
}
