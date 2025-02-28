const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

router.post('/', offerController.getOffers);
router.get('/:id',offerController.getOffer);
router.post('/placeOffer',offerController.placeOffer);

module.exports = router;