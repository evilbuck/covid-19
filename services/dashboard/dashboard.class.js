const Report = require('../../models/reports');

class Dashboard {
  async find(params) {
    console.log('what what');
    let report = await Report.query()
      .select('state')
      .sum('deaths as deaths')
      .sum('cases as cases')
      .groupBy('state', 'date')
      .debug();

    return { data: report };
    // return { test: 'tada' };
  }
}

module.exports = Dashboard;
