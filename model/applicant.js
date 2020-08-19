//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const applicantSchema = new mongoose.Schema({
  name: String,
  college: String,
  resume: Object,
  skills: String,
  city: String,
  // study_year: Date,
  job_id: mongoose.Types.ObjectId,
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
  Question1: String,
  Question2: String,
  Question3: String,
});

module.exports = mongoose.model("Applicant", applicantSchema);
