'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SituationsAbouts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SituationsAbouts.hasMany(models.AboutsCompanies, {foreignKey: 'situationAboutId'});

    }
  }
  SituationsAbouts.init({
    nameSituation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SituationsAbouts',
  });
  return SituationsAbouts;
};