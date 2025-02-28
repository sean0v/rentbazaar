const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/placeOrder', orderController.placeOrder);
router.get('/getOrders/:userId', orderController.getOrders);
router.post('/updateOrder/:id', orderController.updateOrder);

module.exports = router;