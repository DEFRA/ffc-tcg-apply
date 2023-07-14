const { sendMessage } = require('../messaging')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.view('index')
  }
}, {
  method: 'POST',
  path: '/submit',
  handler: async (request, h) => {
    try {
      await sendMessage()
      return h.redirect('confirmation')
    } catch (err) {
      console.error(err)
    }
  }
}]
