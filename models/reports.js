const { Model } = require('objection');

class Report extends Model {
  static get tableName() {
    return 'covid_stats';
  }

  static get relationMappings() {
    const County = require('./county');
  }
}

module.exports = Report;
