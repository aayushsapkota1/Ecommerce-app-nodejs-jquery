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

app.get("/",(req,res)=> {
  res.render('register');
});
app.get("/login",(req,res)=> {
  res.render('login');
});
app.get("/new-product",(req,res)=> {
  res.render('product_form');
});



const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));