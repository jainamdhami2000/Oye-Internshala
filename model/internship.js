//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const internSchema = new mongoose.Schema({
  internName: String,
  internCollege: String,
  image: Object,
  internSkills: String,
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
  isNgo: {
    default: false,
    type: Boolean
  },
  isVerified: {
    default: false,
    type: Boolean
  },
  phoneNumber: Number
});

module.exports = mongoose.model("Intern", internSchema);
