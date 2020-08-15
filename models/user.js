const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.getAdmin = async function () {
  const users = await this.find({ isAdmin: true });
  return users;
};
userSchema.statics.getNewUser = async function () {
  const users = await this.find({ isAdmin: false });
  return users;
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin },config.get("Customer.jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    confirmPassword: Joi.valid(Joi.ref("password")).required(),
  });
  
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
