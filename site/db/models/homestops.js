'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomesTops extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HomesTops.init({
    titleOneTop: DataTypes.STRING,
    titleTwoTop: DataTypes.STRING,
    titleThreeTop: DataTypes.STRING,
    linkBtnTop: DataTypes.STRING,
    txtBtnTop: DataTypes.STRING,
    imageTop: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'HomesTops',
  });
  return HomesTops;
};