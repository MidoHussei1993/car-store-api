const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const mark = require('../routes/mark');
const car = require('../routes/car');
const error = require('../middleware/error');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path');
const cors = require('cors')

const fileStorage = multer.diskStorage({
  destination: (req , file , cb)=>{
    cb(null , 'car-image')
  },
  filename:(req , file , cb)=>{
    cb(null ,  Date.now() + '-' + file.originalname )// his to make sure if user aplouad file with the same name it will work becouse(file.filename)
  }
})
const fileFilter = (req , file ,cb)=>{
  if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/hpeg'){
    cb(null ,true)
  }else{
     cb(null ,false)
  }
}

module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(multer({storage:fileStorage , fileFilter: fileFilter}).array('images',5));
  app.use(express.json());
  app.use(cors());
  app.use('/car-image',express.static('car-image'));
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/mark', mark);
  app.use('/api/car', car);

  app.use(error);
}