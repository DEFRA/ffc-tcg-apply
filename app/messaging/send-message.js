const { MessageSender } = require('ffc-messaging')
const { v4: uuidv4 } = require('uuid')
const { eligibilityTopic } = require('../config/message')
const { createMessage } = require('./create-message')

const sendMessage = async (body) => {
  const sessionId = uuidv4()
  const message = createMessage(body, sessionId)
  const sender = new MessageSender(eligibilityTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendMessage
}
