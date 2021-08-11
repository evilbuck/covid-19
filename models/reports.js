const { Model } = require('objection');

class Report extends Model {
  static get tableName() {
    return 'covid_stats';
  }
}

module.exports = Report;
