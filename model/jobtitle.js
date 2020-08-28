//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jobtitleSchema = new mongoose.Schema({
  job_title: [String],
  job_category: String
});

module.exports = mongoose.model("Jobtitle", jobtitleSchema);
