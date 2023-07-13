const createMessage = (body) => {
  return {
    body,
    type: 'string',
    source: 'source'
  }
}

module.exports = {
  createMessage
}
