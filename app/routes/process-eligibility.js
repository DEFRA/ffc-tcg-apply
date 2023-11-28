const { GET } = require('../constants/http-verbs')
const { USER } = require('../auth/scopes')
const { processEligibility } = require('../processing/process-eligibility')

module.exports = [{
  method: GET,
  path: '/process-eligibility',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    const response = await processEligibility()
    return h.redirect(`/confirmation?referenceNumber=${response.reference}`)
  }
}]
