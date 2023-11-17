const Wreck = require('@hapi/wreck')
const { WRECK_OPTIONS } = require('../constants/wreck-options')

const transitionApplication = async (applicationId, destination) => {
  // TODO check if application is transitioning

  // get the abaco transitionId
  const applicationSummary = await Wreck.get(`http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}`, WRECK_OPTIONS())
  const destinationCode = applicationSummary.payload.availableTransitions.find(transition => transition.toNode === destination)
  // check if transition destination is available
  if (destinationCode) {
    await Wreck.patch(`http://ffc-tcg-api-gateway:3004/applications/transition/${applicationId}/${destinationCode.id}`, WRECK_OPTIONS())
  }
}

module.exports = { transitionApplication }
