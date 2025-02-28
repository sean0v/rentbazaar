const { Offer } = require('../models');
const { Review } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');

exports.getOffers = async (req, res) => {
  try {
    const { name, type, sortBy, order } = req.body;

    let whereConditions = {};

    if (name) {
      whereConditions.name = { [Op.iLike]: `%${name}%` };
    }

    if (type) {
      whereConditions.type = type;
    }

    const sortField = sortBy || 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    let offers = await Offer.findAll({
      where: whereConditions,
      order: [[sortField, sortOrder]]
    });

    res.status(200).json({ offers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await Offer.findByPk(id, {
          include: [
            {
              model: Review,
              as: 'reviews',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['email']
                }
              ]
            }
          ]
        });
      if (!offer) return res.status(404).json({ message: 'Offer not found' });

      res.status(201).json({offer});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.placeOffer = async (req, res) => {
    try {
      const { name, type, price, description, userId, gameId} = req.body;
  
      const newOffer = await Offer.create({ name, type, price, description, userId, gameId });
  
      res.status(201).json({ offerId: newOffer.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };