const { Users2Offers } = require('../models');
const { Offer } = require('../models');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, offerId } = req.body;

    await Users2Offers.create({ userId, offerId, status: 1 });

    res.status(201).json({ message: 'Ok'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
    try {
        const { userId } = req.params;
  
      const orders = await Users2Offers.findAll({ where: {userId: userId}, include:[
        {
            model: Offer,
            as: 'offer'
        },
        
      ],
      order: [['createdAt', 'DESC']]
    });
  
      res.status(201).json({ orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.updateOrder = async (req, res) => {
    try {
        const order = await Users2Offers.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        await order.update({ status: 2 });
      res.status(201).json({ message: 'Ok'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };