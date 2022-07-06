import operand, { OperandV3 } from '@operandinc/sdk'

let client = new OperandV3(process.env.OPERAND_API_KEY, "https://prod.operand.ai")
export default client
