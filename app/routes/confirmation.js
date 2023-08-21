const { v4: uuidv4 } = require('uuid')
const { GET } = require('../constants/http-verbs')

module.exports = {
  method: GET,
  path: '/confirmation',
  handler: (request, h) => {
    return h.view('confirmation', { referenceNumber: uuidv4() })
  }
}
