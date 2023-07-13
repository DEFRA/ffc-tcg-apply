const { MessageSender } = require('ffc-messaging')
const { eligibilityTopic } = require('../config/message')
const { createMessage } = require('./create-message')

const sendMessage = async (body) => {
  const message = createMessage(body)
  const sender = new MessageSender(eligibilityTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendMessage
}
