const Joi = require("@hapi/joi");
const auth = require("../middleware/auth");
const { Mark } = require("../models/mark");
const { pagination } = require("../services/mongoose-helpers");
const mongoose = require('mongoose');
const express = require("express");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let mark = await Mark.findOne({ name: req.body.name });
  if (mark) return res.status(400).send("this is mark is already exist");

  mark = new Mark({ name: req.body.name });
  const result = await mark.save();
  res.status(200).send(result);
});

router.get("/", async (req, res) => {
  pagination(req,res,Mark)
});
router.get("/getNext/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid user id..` });
  const result = await Mark.find({_id: {$gt: req.params.id}}).sort({_id: 1 }).limit(1);
  if(!result)return res.status(400).send('can`t find mark with this id')
  res.status(200).send(result);
});
router.get("/getPrevious/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid user id..` });
  const result = await Mark.find({_id: {$lt: req.params.id}}).sort({_id: -1});
  if(!result)return res.status(400).send('can`t find mark with this id')
  res.status(200).send(result);
});
router.get("/getLast", async (req, res) => {
  const result = await Mark.findOne({}).sort({createdAt: -1})
  if(!result)return res.status(400).send('can`t find mark with this id')
  res.status(200).send(result);
});
router.get("/getFirst", async (req, res) => {
  const result = await Mark.findOne({}).sort({createdAt: 1})
  if(!result)return res.status(400).send('can`t find mark with this id')
  res.status(200).send(result);
});


router.get("/getAll", async (req, res) => {
  const marks = await Mark.find();
  res.status(200).send(marks);
});

function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });

  return schema.validate(req);
}

module.exports = router;
