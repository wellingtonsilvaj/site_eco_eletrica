'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomesServices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HomesServices.init({
    titleService: DataTypes.STRING,
    iconOne: DataTypes.STRING,
    iconTwo: DataTypes.STRING,
    iconThree: DataTypes.STRING,
    titleOneService: DataTypes.STRING,
    titleTwoService: DataTypes.STRING,
    titleThreeService: DataTypes.STRING,
    descOneService: DataTypes.STRING,
    descTwoService: DataTypes.STRING,
    descThreeService: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HomesServices',
  });
  return HomesServices;
};