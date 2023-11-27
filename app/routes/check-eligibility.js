const { GET } = require('../constants/http-verbs')
const { USER } = require('../auth/scopes')
// const { processEligibility } = require('../processing/process-eligibility')

module.exports = [{
  method: GET,
  path: '/check-eligibility',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    // const response = await processEligibility()
    const response = { reference: '1' }
    return h.redirect(`/confirmation?referenceNumber=${response.reference}`)
  }
}]
