const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')




const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim:true
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  }
});



userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ 
    _id: this._id,
    name: this.name,
    email: this.email
  }, 'DontUserThisKEYHereForProduction');
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validateUser;



