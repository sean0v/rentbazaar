const { Review } = require('../models');

exports.placeReview = async (req, res) => {
  try {
    const { mark, description, userId, offerId } = req.body;

    await Review.create({ mark, description, userId, offerId });

    res.status(201).json({ message: 'Ok'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};