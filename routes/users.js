const auth = require('../authorizationmiddleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const multer=require('multer');
const { applyFunctionToChildren } = require('joi/lib/types/lazy');

const Storage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./static/users')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"--"+file.originalname)
  }
});

const upload=multer({storage:Storage}).single('file');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', upload, async (req, res) => {
 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password','address']));
  
  if (req.file){
    user.image=req.file.filename;

  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email','address']));
});

module.exports = router; 