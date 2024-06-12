'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Footers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Footers.init({
    footerDesc: DataTypes.STRING,
    footerTextLink: DataTypes.STRING,
    footerLink: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Footers',
  });
  return Footers;
};