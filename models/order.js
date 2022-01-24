const Joi = require('joi');
const mongoose = require('mongoose');

const Order = mongoose.model('Order', new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required: true
  },
  quantity:{
    type:Number,
    required:true
  },
  totalPrice:{
      type: String,
      required:true
  },
  datePlaced: { 
    type: Date, 
    required: true,
    default: Date.now
  }
 
}));

function validateOrder(order) {
  const schema = {
    userId: Joi.objectId().required(),
    productId: Joi.objectId().required(),
    quantity:Joi.number.min(1).required()
  };

  return Joi.validate(order, schema);
}

exports.Order = Order; 
exports.validate = validateOrder;