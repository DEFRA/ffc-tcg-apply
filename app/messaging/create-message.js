const createMessage = (body, sessionId) => {
  return {
    body,
    sessionId,
    type: 'string',
    source: 'source'
  }
}

module.exports = {
  createMessage
}
