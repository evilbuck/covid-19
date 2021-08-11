const Report = require('../../models/reports');

class Dashboard {
  async find(params) {
    console.log('what what');
    let report = await Report.query()
      .select('state', 'date')
      .sum('deaths as deaths')
      .sum('cases as cases')
      .groupBy('state', 'date')
      .debug();

    return { data: report };
  }
}

module.exports = Dashboard;
