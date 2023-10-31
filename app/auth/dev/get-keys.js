const { authConfig } = require('../../config')

const getKeys = async () => {
  return {
    privateKey: authConfig.devAuthPrivateKey,
    publicKey: authConfig.devAuthPublicKey
  }
}

module.exports = {
  getKeys
}
