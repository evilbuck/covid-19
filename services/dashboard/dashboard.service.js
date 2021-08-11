const Dashboard = require('./dashboard.class');

module.exports = function (app) {
  app.use('dashboard', new Dashboard());
};
