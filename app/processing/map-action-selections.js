const mapActionSelections = (payload) => {
  const mappedActions = []
  for (const [key, value] of Object.entries(payload)) {
    mappedActions.push({ prizeCode: key, value })
  }
  return mappedActions
}

module.exports = { mapActionSelections }
