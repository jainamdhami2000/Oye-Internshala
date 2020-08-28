//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jobtitleSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("Jobtitle", jobtitleSchema);
