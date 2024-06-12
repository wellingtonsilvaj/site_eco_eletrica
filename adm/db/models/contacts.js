'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contacts.init({
    titleContact: DataTypes.STRING,
    SubTitleContact: DataTypes.STRING,
    iconCompany: DataTypes.STRING,
    titleCompany: DataTypes.STRING,
    descCompany: DataTypes.STRING,
    iconAddress: DataTypes.STRING,
    titleAdress: DataTypes.STRING,
    descAddress: DataTypes.STRING,
    iconEmail: DataTypes.STRING,
    titleEmail: DataTypes.STRING,
    descEmail: DataTypes.STRING,
    titleForm: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contacts',
  });
  return Contacts;
};