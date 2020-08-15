const auth = require('../middleware/auth');
const {Car , validate} = require('../models/car');
const _ = require('lodash')
const fs = require('fs')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

router.post('/',auth, async (req, res) => {
  const images = req.files;
  if(!images.length >= 1) return res.status(400).send('you should send one image at least')
  
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
//   let car = await Car.findOne({ model: req.body.model });
//   if (Car) return res.status(400).send('this is mark is already exist');
  const car = new Car(_.merge({...req.body},{carImages: images.map(item => item.path)}));
  const result = await car.save();
  res.status(200).send(_.merge({_id:result._id , carImages:result.carImages}))
});

router.get('/lastInserted', async (req , res)=>{
  const result = await Car.find({}).sort({createdAt:-1})
  .populate({path:'mark',model:'Mark',select:{name:1,_id:0}}).limit(10)
  .select({
    model : 1,
    license: 1,
    mark: 1,
    drive: 1,
    type: 1,
    fuel: 1,
    price: 1,
    createdAt: 1,
    description: 1,
    mainImage : 1
  })
  res.send(result);
})
router.get('/getAll', async (req , res)=>{
  const result = await Car.find({})
  .select({
    model : 1,
    license: 1,
    drive: 1,
    mark: 1,
    price: 1,
    type: 1,
    fuel: 1,
    kilometerStand: 1,
    price: 1
  })
  res.send(result);
})
router.put('/mainImage/:id', async (req , res)=>{
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid user id..` });
  const result = await Car.findByIdAndUpdate(req.params.id,{
    $set:{
      mainImage: req.body.mainImage?req.body.mainImage:''
    }
  },{
    new: true,
    fields:{mainImage:1 , model: 1}
  });
  if(!result)return res.status(400).send('can`t find car with this id')
  res.status(200).send(result);
})

router.delete('/:id',async (req,res)=>{
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid user id..` });

  const car = await Car.findByIdAndDelete(req.params.id);
  if(!car) return res.status(400).send('not fond car with this id')
  if(car.carImages.length >= 1){
    car.carImages.map(item =>{
       fs.unlinkSync(item)
    })
  }
  
  res.send(`the ${car.model} delete it`);
})




module.exports = router; 