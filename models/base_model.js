const { Model, AjvValidator } = require('objection');

class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {},
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
        v5: true,
        coerceTypes: true,
      },
    });
  }
}
module.exports = BaseModel;
