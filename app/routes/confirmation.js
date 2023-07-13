module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: (request, h) => {
    console.log('some logic here to confirm session queue logic here')
    return h.view('confirmation', { referenceNumber: 'abcdefg' })
  }
}
