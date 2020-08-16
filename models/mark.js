const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
 name:{type:String}
},{
    timestamps: true
})

const Mark = mongoose.model('Mark',markSchema);

exports.Mark = Mark;
