const Joi = require("@hapi/joi");
const auth = require("../middleware/auth");
const { Mark } = require("../models/mark");
const { pagination } = require("../services/mongoose-helpers");
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
