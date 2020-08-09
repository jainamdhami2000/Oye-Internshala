//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const internSchema = new mongoose.Schema({
  job_title: String,
  job_duration: String,
  image: Object,
  job_content: String,
  job_stipened: String,
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  is_accept: {
    type: Boolean,
    default: false
  },
  is_reject: {
    type: Boolean,
    default: false
  },
  admin_accept: {
    type: Boolean,
    default: false
  },
  admin_reject: {
    type: Boolean,
    default: false
  },
  company_name: String,
  job_category: String,
  job_location: String,
  job_published: {
    type: Date,
    default: Date.now()
  },
  jobtype: String,
  intake: Number,
  start_date: Date,
  apply_last: Date,
  onsite: {
    type: Boolean,
    default: false
  },
  requirements: String,
  paid: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("Intern", internSchema);
