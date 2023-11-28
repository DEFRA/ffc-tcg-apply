const WRECK_OPTIONS = (payload, auth) => {
  return {
    headers: {
      authorization: `Bearer ${auth}`
    },
    rejectUnauthorized: false,
    json: true,
    payload
  }
}

module.exports = { WRECK_OPTIONS }
