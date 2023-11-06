const Wreck = require('@hapi/wreck')
const { WRECK_OPTIONS } = require('../constants/wreck-options')

const transitionApplication = async (applicationId, destination) => {
  // get the abaco transitionId
  const applicationSummary = await Wreck.get(`http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}`, WRECK_OPTIONS())
  const destinationCode = applicationSummary.payload.availableTransitions.find(transition => transition.toNode === destination)
  // check if application is transitioning
  // check if transition destination is available
  await Wreck.patch(`http://ffc-tcg-api-gateway:3004/applications/transition/${applicationId}/${destinationCode.id}`, WRECK_OPTIONS())
}

module.exports = { transitionApplication }
