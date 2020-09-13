//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = new mongoose.Schema({
  local: {
    password: String,
  },
  facebook: {
    id: String,
    token: String,
  },
  linkedin: {
    id: String,
    token: String
  },
  github: {
    id: String,
    token: String
  },
  google: {
    id: String,
    token: String,
  },
  username: String,
  FirstName: String,
  LastName: String,
  image: Object,
  CollegeName: String,
  City: String,
  YearOfStudy: Date,
  BasicSkills: String,
  Email: String,
  loginType: {
    type: String
  },
  CompanyName: String,
  MainOfficeLocation: String,
  isStudent: {
    default: false,
    type: Boolean
  },
  isEmployer: {
    default: false,
    type: Boolean
  },
  isTrainer: {
    default: false,
    type: Boolean
  },
  isVerified: {
    default: false,
    type: Boolean
  },
  DateofBirth:Date,
  phoneNumber: Number,
  admin_accept: Boolean,
  admin_reject: Boolean,
  CompanyDescription: String,
  resume:Object
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", userSchema);
