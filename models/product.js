const Joi = require('joi');
const { strict } = require('joi/lib/types/lazy');
const string = require('joi/lib/types/string');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');

const Product = mongoose.model('Products', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  description: {
    type: String
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0
  },
  price: { 
    type: String, 
    required: true,
    min: 0,
    max: 255
  },
  image: String
}));

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    quantity: Joi.number().integer().min(0).required(),
    price: Joi.string().min(0).required(),
    description: Joi.string()
  };

  return Joi.validate(product, schema);
}

exports.Product = Product; 
exports.validate = validateProduct;