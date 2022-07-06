import operand from "lib/operand";

export default async function handler(req, res) {
  const { q: query } = req.query;
  const data = await operand.searchContents({
    parentIds: [process.env.OPERAND_COLLECTION_ID],
    query: query,
    max: 16,
    filter: {},
  });
  const response = new Array();
  data.contents.forEach((atom) => {
    if (!response.find((post) => post.groupId == atom.objectId)) {
      const post = data.objects[atom.objectId];
      let metadata = post.metadata as { html: string; title?: string };
      response.push({
        question: metadata.title,
        answer: metadata.html,
        groupId: post.id,
      });
    }
  });
  res.status(200).json(response);
}
