const { Model } = require('objection');

class County extends Model {
  static get tableName() {
    return 'counties';
  }
}
