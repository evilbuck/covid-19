const reportsService = require('./reports/reports.service');
module.exports = function (app) {
  app.configure(reportsService);
};
