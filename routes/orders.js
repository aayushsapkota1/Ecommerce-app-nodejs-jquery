const {Order, validate} = require('../models/order'); 
const {Product} = require('../models/product'); 
const {User} = require('../models/user'); 
const mongoose = require('mongoose');
//const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

//Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const orders = await Order
    .find()
    .populate('product')
    .populate('user')
    .sort('-datePlaced');
  res.send(orders);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid customer.');

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send('Invalid product.');

  if (product.numberInStock === 0) return res.status(400).send('Product not in stock.');

  let order = new Order({ 
    user:  user._id,
    product: product._id,
    quantity: req.body.quantity,
    totalPrice: (parseInt(product.price))*(req.body.quantity)
  });

  await order.save();

  product.numberInStock--;
  product.save();
  
  res.send(order);

  // try {
  //   new Fawn.Task()
  //     .save('orders', order)
  //     .update('products', { _id: product._id }, { 
  //       $inc: { numberInStock: -1 }
  //     })
  //     .run();
  
  //   res.send(order);
  // }
  // catch(ex) {
  //   res.status(500).send('Something failed.');
  // }
});

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product').populate('user');

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  res.send(order);
});

module.exports = router; 