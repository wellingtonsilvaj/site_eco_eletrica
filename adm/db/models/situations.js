'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class situations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definir as associações
      situations.hasMany(models.users, { foreignKey: 'situationId' })
    }
  }
  situations.init({
    nameSituation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'situations',
  });
  return situations;
};