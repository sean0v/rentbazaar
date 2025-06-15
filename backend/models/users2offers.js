'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users2Offers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users2Offers.init({
    userId: DataTypes.INTEGER,
    offerId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users2Offers',
  });

  Users2Offers.associate = (models) => {
    Users2Offers.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Users2Offers.belongsTo(models.Offer, { foreignKey: 'offerId', as: 'offer' });
  };

  return Users2Offers;
};