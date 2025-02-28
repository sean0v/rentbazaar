'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Offer.init({
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Offer',
  });

  Offer.associate = (models) => {
    Offer.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' });
    Offer.belongsTo(models.User, { foreignKey: 'userId', as: 'postByUser' });
    Offer.hasMany(models.Review, { foreignKey: 'offerId', as: 'reviews' });
    Offer.hasMany(models.Users2Offers, { foreignKey: 'offerId', as: 'boughtByUsers' });
  };
  return Offer;
};