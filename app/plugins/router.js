const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/'),
  require('../routes/sign-in-oidc'),
  require('../routes/sign-in'),
  require('../routes/sign-out'),
  require('../routes/confirmation'),
  require('../routes/eligible-organisations'),
  require('../routes/start-application'),
  require('../routes/task-list'),
  require('../routes/check-eligibility'),
  require('../routes/confirm-management-control'),
  require('../routes/agreement-name'),
  require('../routes/process-eligibility'),
  require('../routes/action-selection'),
  require('../routes/apply-for-sfi-actions'),
  require('../routes/check-your-answers'),
  require('../routes/submit-your-application')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
