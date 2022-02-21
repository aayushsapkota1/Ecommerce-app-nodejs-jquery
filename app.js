const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const categories = require('./routes/categories');
const users = require('./routes/users');
const products = require('./routes/products');
const orders = require('./routes/orders');
const authentication = require('./routes/authentication');
const express = require('express');
const app = express();
const path= require('path');
const bodyParser= require('body-parser'); 
const req = require('express/lib/request');
const Product= require('./models/product');



app.use(express.static(__dirname+"/public"));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/ecommerce')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/categories', categories);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/users', users);
app.use('/api/auth', authentication);

//views route
app.get("/login",(req,res)=> {
  res.render('login');
});
app.get("/",(req,res)=> {
  res.render('homepage.ejs');
});
//user views
app.get("/register",(req,res)=> {
  res.render('register');
});
app.get("/products-client",(req,res)=> {
  res.render('products-client');
});
app.get("/new-order",(req,res)=> {
  res.render('new-order');
});
app.get("/update-order",(req,res)=> {
  res.render('update-order');
});
app.get("/myorders",(req,res)=> {
  res.render('myorder');
});
app.get("/paywithkhalti",(req,res)=> {
  res.render('khalti');
});
//admin views
app.get("/new-product",(req,res)=> {
  res.render('product_form');
});
app.get("/user-list",(req,res)=> {
  res.render('users');
});
app.get("/products-admin",(req,res)=> {
  res.render('products');
});
app.get("/update-product",(req,res)=> {
  res.render('updateProduct');
});
app.get("/orders",(req,res)=> {
  res.render('orders');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));