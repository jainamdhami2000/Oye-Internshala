//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const internSchema = new mongoose.Schema({
  intern_name: String,
  intern_college: String,
  resume: Object,
  intern_skills: String,
  intern_city: String,
  intern_study_year: Date,
  job_title_id: mongoose.Types.ObjectId,
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
});

module.exports = mongoose.model("Intern", internSchema);
