module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: (request, h) => {
    return h.view('confirmation', { referenceNumber: 'abcdefg' })
  }
}
