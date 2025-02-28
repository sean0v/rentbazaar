const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/placeReview', reviewController.placeReview);

module.exports = router;