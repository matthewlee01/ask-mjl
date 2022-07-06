import operand from "lib/operand";

export default async function handler(req, res) {
  const { q: query } = req.query;
  const relatedResponse = await operand.searchRelated({
      objectId: query,
      max: 8,
    });
  const related = relatedResponse?.objects?.map((group) => {
    const metadata = group.metadata as { title: string, html: string,};
    return {
      question: metadata.title,
      answer: metadata.html,
      operandId: group.id
    }
 })
  res.status(200).json(related ? related : []);
}
