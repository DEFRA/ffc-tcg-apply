const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/'),
  require('../routes/sign-in-oidc'),
  require('../routes/sign-in'),
  require('../routes/sign-out'),
  require('../routes/check-eligibility'),
  require('../routes/confirmation'),
  require('../routes/eligible-organisations'),
  require('../routes/start-application'),
  require('../routes/task-list'),
  require('../routes/check-land-details'),
  require('../routes/confirm-management-control'),
  require('../routes/agreement-name')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
