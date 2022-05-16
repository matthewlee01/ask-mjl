import operand, { Operand } from '@operandinc/sdk'

let client = new Operand(process.env.OPERAND_API_KEY, "https://core.operand.ai")
export default client
