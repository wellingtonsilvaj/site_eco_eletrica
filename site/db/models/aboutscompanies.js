'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AboutsCompanies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // definir associações
      AboutsCompanies.belongsTo(models.SituationsAbouts, { foreignKey: 'situationAboutId' });
    }
  }
  AboutsCompanies.init({
    titleAboutsCompanies: DataTypes.STRING,
    descAboutsCompanies: DataTypes.TEXT,
    imageAboutsCompanies: DataTypes.STRING,
    situationAboutId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AboutsCompanies',
  });
  return AboutsCompanies;
};