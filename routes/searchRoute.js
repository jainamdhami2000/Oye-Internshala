//jshint esversion:6

const express = require('express');
const sanitize = require('mongo-sanitize');
const searchRouter = express.Router();
const Job = require('../model/job');
const Applicant = require('../model/applicant');

searchRouter.post('/internship',isLoggedIn, function(req, res, next) {
  var q = req.body.searchInput;
  var query = {};
  query.$and = [];
  param = {};
  if (req.body.job_category !== '') {
    param.job_category = req.body.job_category;
    query.$and.push({
      job_category: req.body.job_category
    });
  }
  if (req.body.job_title !== '') {
    param.job_title = req.body.job_title;
    query.$and.push({
      job_title: req.body.job_title
    });
  }
  if (req.body.job_location !== '') {
    param.job_location = req.body.job_location;
    query.$and.push({
      job_location: req.body.job_location
    });
  } else if (req.body.home == 'on') {
    param.home = req.body.home;
    query.$and.push({
      onsite: false
    });
  }
  if (req.body.internship == 'on') {
    param.internship = req.body.internship;
    query.$and.push({
      jobtype: 'Internship'
    });
  } else if (req.body.job == 'on') {
    param.job = req.body.job;
    query.$and.push({
      jobtype: 'Job'
    });
  }
  if (req.body.start_date !== '') {
    param.start_date = req.body.start_date;
    query.$and.push({
      apply_last: {
        $gte: req.body.start_date
      }
    });
  }
  if (req.body.duration !== '') {
    param.duration = req.body.duration;
    query.$and.push({
      job_duration: req.body.duration
    });
  }
  query.$and.push({
    admin_accept: true
  });
  console.log(param);
  Applicant.find({
    user_id: req.user._id
  }, (err, applicants) => {
    var appids = [];
    var unappliedjobs = [];
    applicants.forEach((applicant) => {
      appids.push(String(applicant.job_id));
    });
    Job.find(query, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        result.forEach(job => {
          if (appids.includes(String(job._id))) {

          } else {
            unappliedjobs.push(job);
          }
        });
        res.render('getintern', {
          user: req.user,
          jobs: unappliedjobs,
          parameters:param
        });
      }
    });
  });
});

function isLoggedIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      req.isLogged = true;
      return next();
    }
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
}

module.exports = searchRouter;
