const { GET } = require('../constants/http-verbs')
const { processEligibility } = require('../processing/process-eligibility')

module.exports = [{
  method: GET,
  path: '/',
  handler: (request, h) => {
    return h.view('index')
  }
}, {
  method: GET,
  path: '/start',
  handler: async (request, h) => {
    try {
      const response = await processEligibility()
      return h.view('confirmation', { referenceNumber: response.reference })
    } catch (err) {
      console.error(err)
    }
  }
}]
