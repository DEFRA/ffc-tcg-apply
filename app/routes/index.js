const { sendMessage } = require('../messaging')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.view('index')
  }
}, {
  method: 'GET',
  path: '/start',
  handler: async (request, h) => {
    try {
      await sendMessage()
      return h.view('confirmation')
    } catch (err) {
      console.error(err)
    }
  }
}]
