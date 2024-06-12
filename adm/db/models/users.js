'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definir as associações

      users.belongsTo(models.situations, { foreignKey: 'situationId' });
    }
  }
  users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    recoverPassword: DataTypes.STRING,
    confEmail: DataTypes.STRING,
    image: DataTypes.STRING,
    situationId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};