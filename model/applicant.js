//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const applicantSchema = new mongoose.Schema({
  name: String,
  job_title: String,
  job_category: String,
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
  applied_on: {
    type: Date,
    default: Date.now()
  },
  company_name: String,
  Question1: String,
  Question2: String,
  Question3: String,
  course_link:String,
  isCourse: Boolean,
});

module.exports = mongoose.model("Applicant", applicantSchema);
