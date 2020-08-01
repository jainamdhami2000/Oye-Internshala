//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const internSchema = new mongoose.Schema({
  job_title: String,
  job_duration: String,
  image: Object,
  job_content: String,
  job_stipened: String,
  user_id: mongoose.Types.ObjectId,
  is_accept: {
    type: Boolean,
    default: false
  },
  is_reject: {
    type: Boolean,
    default: false
  },
  company_name: String,
  job_category:String,
  job_location:String,
  job_published:{
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Intern", internSchema);
