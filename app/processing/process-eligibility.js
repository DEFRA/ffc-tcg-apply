const util = require('util')
const { v4: uuidv4 } = require('uuid')
const { eligibilityQueue } = require('../config/message')
const { sendMessage, receiveMessage } = require('../messaging')

const processEligibility = async () => {
  const sessionId = uuidv4()
  const request = { message: 'test', reference: '1' }
  await sendMessage(request, sessionId)
  console.info('Data request sent:', util.inspect(request, false, null, true))
  const response = await receiveMessage(sessionId, eligibilityQueue)
  if (response) {
    console.info('Data response received:', util.inspect(response, false, null, true))
    return response
  }
}

module.exports = {
  processEligibility
}

// const getData = async (category, value) => {
//   const messageId = uuidv4()
//   const request = { category, value }
//   await sendMessage(request, TYPE, config.messageConfig.dataTopic, { messageId })
//   console.info('Data request sent:', util.inspect(request, false, null, true))
//   const response = await receiveMessage(messageId, config.messageConfig.dataQueue)
//   if (response) {
//     console.info('Data response received:', util.inspect(response, false, null, true))
//     return response.data
//   }
// }
