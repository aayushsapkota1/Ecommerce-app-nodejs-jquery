const {Order, validate} = require('../models/order'); 
const {Product} = require('../models/product'); 
const {User} = require('../models/user'); 
const mongoose = require('mongoose');
//const Fawn = require('fawn');
const express = require('express');
const router = express.Router();
const auth = require('../authorizationmiddleware/auth');
//Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const orders = await Order
    .find()
    .populate('product','name -_id')
    .populate('user')
    // .populate('quantity')
    // .populate('datePlaced')
    .sort('-datePlaced');
  res.send(orders);
});

router.post('/', auth,async (req, res) => {

  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid customer.');

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send('Invalid product.');

  if (product.quantity < req.body.quantity) return res.status(400).send('Product not in stock.');

  let order = new Order({ 
    user:  user._id,
    product: product._id,
    quantity: req.body.quantity,
    totalPrice: (parseInt(product.price))*(req.body.quantity)
  });

  await order.save();

  product.quantity= product.quantity-req.body.quantity;
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

router.put('/:id', auth,async (req, res) => {
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid customer.');

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send('Invalid product.');

  

  // const order = await Order.findByIdAndUpdate(req.params.id,
  //   { 
  //     user: user._id,
  //     product: product._id,
  //     quantity: req.body.quantity,
  //     totalPrice: (parseInt(product.price))*(req.body.quantity)
  //   });

  const order= await Order.findById(req.params.id);
  if (!order) return res.status(404).send('The order with the given ID was not found.');


  product.quantity=product.quantity+order.quantity;
  if (product.quantity < req.body.quantity) return res.status(400).send('Product not in stock.');
  product.quantity=product.quantity- req.body.quantity;

  order.set({
    user: user._id,
    product: product._id,
    quantity: req.body.quantity,
    totalPrice: (parseInt(product.price))*(req.body.quantity)
  });

  await product.save();
  await order.save();
  res.send(order);
});

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product').populate('user');

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  res.send(order);
});

router.delete('/:id',auth, async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);
  if (!order) return res.status(404).send('The order with the given ID was not found.');
  
  const product = await Product.findById(order.product);
  product.quantity= product.quantity+ order.quantity;
  product.save();

  res.send(order);
});

module.exports = router; 