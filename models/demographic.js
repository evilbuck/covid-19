const { Model } = require('objection');

class Demographic extends Model {
  static get tableName() {
    return 'counties';
  }

  static modifiers = {
    state(builder) {
      builder.groupBy('state').sum('population as population').select('state');
    },
  };
}

module.exports = Demographic;
