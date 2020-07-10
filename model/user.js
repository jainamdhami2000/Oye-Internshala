//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = new mongoose.Schema({
  UserId: String,
  local: {
    password: String,
  },
  facebook: {
    id: String,
    token: String,

  },
  google: {
    id: String,
    token: String,
  },
  Name: String,
  Email: String,
  loginType: {
    type: String
  },
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", userSchema);
