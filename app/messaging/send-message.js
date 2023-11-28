const { MessageSender } = require('ffc-messaging')
const { eligibilityQueue } = require('../config/message')
const { createMessage } = require('./create-message')

const sendMessage = async (body, sessionId) => {
  const message = createMessage(body, sessionId)
  const sender = new MessageSender(eligibilityQueue)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendMessage
}
