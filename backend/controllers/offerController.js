const { User } = require('../models');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/offers'),
  filename:    (req, file, cb) =>
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const { Op, literal } = require('sequelize');
const { Offer, Review } = require('../models');
const {  OfferImage } = require('../models');

exports.getOffers = async (req, res) => {
  try {
    const { name, type, sortBy, order } = req.body;

    const whereConditions = {};
    if (name) {
      whereConditions.name = { [Op.iLike]: `%${name}%` };  
    }
    if (type) {
      whereConditions.type = type;
    }

    const ratingLiteral = literal(`(
      SELECT COALESCE(AVG("mark"), 0)
      FROM "Reviews" AS "review"
      WHERE "review"."offerId" = "Offer"."id"
    )`);

    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    const orderClause =
      sortBy === 'rating'
        ? [[ratingLiteral, sortOrder]]
        : [[sortBy || 'name', sortOrder]];

    const offers = await Offer.findAll({
      where: whereConditions,
      attributes: {
        include: [[ratingLiteral, 'rating']]
      },
      order: orderClause
    });

    return res.status(200).json({ offers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
        },
        {
          model: OfferImage,      
          as: 'images',
          attributes: ['url', 'alt', 'order'],
          order: [['order', 'ASC']] 
        }
      ]
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    return res.status(200).json({ offer });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

  exports.placeOffer = async (req, res) => {
  const t = await Offer.sequelize.transaction(); 
  try {
    const { name, type, price, description, userId, gameId } = req.body;
    const files = req.files || [];                

    
    const newOffer = await Offer.create(
      { name, type, price, description, userId, gameId },
      { transaction: t }
    );

    
    if (files.length) {
      const records = files.map((f, idx) => ({
        offerId: newOffer.id,
        url: `/uploads/offers/${f.filename}`,
        order: idx,
        alt: f.originalname
      }));
      await OfferImage.bulkCreate(records, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ offerId: newOffer.id });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  const t = await Offer.sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, type, price, description } = req.body;
    const files = req.files || [];

    const offer = await Offer.findByPk(id, { include: { model: OfferImage, as: 'images' }, transaction: t });
    if (!offer) {
      await t.rollback();
      return res.status(404).json({ message: 'Offer not found' });
    }

    await offer.update(
      { name, type, price, description },
      { transaction: t, fields: ['name', 'type', 'price', 'description'].filter(f => req.body[f] !== undefined) }
    );

    if (files.length) {
      for (const img of offer.images) {
        const fullPath = path.join('.', img.url); 
        fs.unlink(fullPath).catch(() => {});      
      }

      await OfferImage.destroy({ where: { offerId: id }, transaction: t });

      const records = files.map((f, idx) => ({
        offerId: id,
        url: `/uploads/offers/${f.filename}`,
        order: idx,
        alt: f.originalname
      }));
      await OfferImage.bulkCreate(records, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ message: 'Offer updated' });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteOffer = async (req, res) => {
  const t = await Offer.sequelize.transaction();
  try {
    const { id } = req.params;

    const offer = await Offer.findByPk(id, { include: { model: OfferImage, as: 'images' }, transaction: t });
    if (!offer) {
      await t.rollback();
      return res.status(404).json({ message: 'Offer not found' });
    }

    for (const img of offer.images) {
      const fullPath = path.join('.', img.url);
      fs.unlink(fullPath).catch(() => {}); 
    }

    await offer.destroy({ transaction: t });

    await t.commit();
    return res.status(204).end();
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyOffers = async (req, res) => {
  try {
    const { userId } = req.params;              

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const ratingLiteral = literal(`(
      SELECT COALESCE(AVG("mark"), 0)
      FROM "Reviews" AS "review"
      WHERE "review"."offerId" = "Offer"."id"
    )`);

    const offers = await Offer.findAll({
      where: { userId },
      attributes: {
        include: [[ratingLiteral, 'rating']]
      },
      include: [
        {
          model: OfferImage,
          as: 'images',
          attributes: ['url', 'alt', 'order'],
          order: [['order', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ offers });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};