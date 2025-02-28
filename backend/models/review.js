'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Review.init({
    mark: DataTypes.INTEGER,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    offerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Review.belongsTo(models.Offer, { foreignKey: 'offerId', as: 'offer' });
  };
  return Review;
};