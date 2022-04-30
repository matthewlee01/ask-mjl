import operand from 'lib/operand';

export default async function handler(req, res) {
  const { q: operandId } = req.query
  const related = (await operand.related(
      operandId,
      [process.env.OPERAND_COLLECTION_ID],
      8
    )).groups.map((group) => {
      return {
        question: group.metadata.title,
        answer: group.metadata.html,
        score: group.score,
      }
    });
    res.status(200).json(related);
  }