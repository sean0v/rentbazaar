const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const multer  = require('multer');
const path    = require('path');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/offers'),
  filename:    (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/', offerController.getOffers);
router.get('/:id',offerController.getOffer);
router.post('/placeOffer', upload.array('images', 10), offerController.placeOffer);
router.put('/:id', upload.array('images', 10), offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer); 
router.get('/myOffers/:userId', offerController.getMyOffers);

module.exports = router;