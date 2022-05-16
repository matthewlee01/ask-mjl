import operand from 'lib/operand'

export default async function handler(req, res) {
  const { q: query } = req.query
  const data = await operand.search({collections: [process.env.OPERAND_COLLECTION_ID], query: query, limit: 16, filter: {}})
  const response = new Array();
  data.atoms?.forEach((atom) => {
    if (!response.find((post) => (post.groupId == atom.groupId))) {
      const post = data.groups[atom.groupId];
      let metadata = post.metadata as {html: string, title?: string}
      response.push({
        question: metadata.title,
        answer: metadata.html,
        groupId: post.id,
      });
    }
  })
  res.status(200).json(response)
}