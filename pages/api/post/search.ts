import operand from 'lib/operand'

export default async function handler(req, res) {
  const { q: query } = req.query
  const data = await operand.search([process.env.OPERAND_COLLECTION_ID], query, 16)
  const response = new Array();
  data.atoms.forEach((atom) => {
    if (!response.find((post) => (post.groupId == atom.groupId))) {
      const post = data.groups[atom.groupId].metadata;
      post.groupId = atom.groupId;
      response.push({
        question: post.title,
        answer: post.html,
        groupId: post.groupId,
      });
    }
  })
  res.status(200).json(response)
}