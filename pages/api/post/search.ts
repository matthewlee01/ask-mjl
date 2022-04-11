import prisma from 'lib/prisma';
import operand from 'lib/operand'

export default async function handler(req, res) {
  const { q: query } = req.query
  const response = await operand.search([process.env.OPERAND_COLLECTION_ID], query, 12)

  res.status(200).json(response)
}