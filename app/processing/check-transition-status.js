const { GET } = require('../constants/http-verbs')
const { asyncRetry } = require('../processing/async-retry')

const checkTransitionStatus = async (applicationSummary, applicationId, authToken, retries = 3) => {
  let inTransition = false
  while (inTransition) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      applicationSummary = await asyncRetry({
        method: GET,
        url: `http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}`,
        auth: authToken
      })

      inTransition = applicationSummary.inTransition
      retries++
    } catch (error) {
      throw new Error('application could not transition')
    }
  }
}
module.exports = { checkTransitionStatus }
