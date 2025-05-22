'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OfferImage extends Model {
    static associate(models) {
      OfferImage.belongsTo(models.Offer, {
        foreignKey: 'offerId',
        as: 'offer'
      });
    }
  }
  OfferImage.init(
    {
      offerId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      alt: DataTypes.STRING,
      order: DataTypes.INTEGER
    },
    { sequelize, modelName: 'OfferImage' }
  );
  return OfferImage;
};