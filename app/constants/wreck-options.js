const { TCG_TEMP_AUTH } = require('./cookies')

const WRECK_OPTIONS = (payload) => {
  return {
    headers: {
      authorization: `Bearer ${TCG_TEMP_AUTH}`
    },
    rejectUnauthorized: false,
    json: true,
    payload
  }
}

module.exports = { WRECK_OPTIONS }
