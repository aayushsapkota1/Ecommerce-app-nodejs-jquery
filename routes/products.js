const {Product, validate} = require('../models/product'); 
const {Category} = require('../models/category');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const multer=require('multer');

const Storage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./static/products')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"--"+file.originalname)
  }
});

const upload=multer({storage:Storage}).single('file');


router.get('/', async (req, res) => {
  const products = await Product.find().sort('name');
  res.send(products);
});

router.post('/', upload, async (req, res) => {
  // console.log(req.body);
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  // const category = await Category.findById(req.body.categoryId);
  // if (!category) return res.status(400).send('Invalid category.');

  const product = new Product({ 
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.description
  });

  if (req.file){
    product.image=req.file.filename;
  };

  await product.save();
  
  res.send(product);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // const category = await Category.findById(req.body.categoryId);
  // if (!category) return res.status(400).send('Invalid category.');

  const product = await Product.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      // category: {
      //   _id: category._id,
      //   name: category.name
      // },
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      description:req.body.description
    }, { new: true });

  if (!product) return res.status(404).send('The product with the given ID was not found.');
  
  res.send(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

module.exports = router; 