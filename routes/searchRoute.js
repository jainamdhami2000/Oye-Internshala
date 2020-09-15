//jshint esversion:6

const express = require('express');
const sanitize = require('mongo-sanitize');
const searchRouter = express.Router();
const Job = require('../model/job');
const Applicant = require('../model/applicant');

searchRouter.post('/internship', function(req, res, next) {
  var query = {};
  query.$and = [];
  param = {};
  if (req.body.job_category !== '' && req.body.job_category !== undefined && req.body.job_category != 'none') {
    param.job_category = req.body.job_category;
    query.$and.push({
      job_category: req.body.job_category
    });
  }
  if (req.body.job_title !== '' && req.body.job_title !== undefined && req.body.job_title != 'none') {
    param.job_title = req.body.job_title;
    query.$and.push({
      job_title: req.body.job_title
    });
  }
  if (req.body.home == 'on') {
    param.home = req.body.home;
    query.$and.push({
      onsite: false
    });
  } else if (req.body.job_location !== '' && req.body.job_location !== undefined && req.body.job_location != 'none') {
    param.job_location = req.body.job_location;
    query.$and.push({
      job_location: req.body.job_location
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
  } else if (req.body.course == 'on') {
    param.course = req.body.course;
    query.$and.push({
      jobtype: 'Course'
    });
  }
  if (req.body.start_date !== '' && req.body.start_date !== undefined) {
    param.start_date = req.body.start_date;
    query.$and.push({
      apply_last: {
        $gte: req.body.start_date
      }
    });
  }
  if (req.body.duration !== '' && req.body.duration !== undefined) {
    param.duration = req.body.duration;
    query.$and.push({
      job_duration: req.body.duration
    });
  }
  if (req.body.parttime == 'on') {
    param.parttime = req.body.parttime;
    query.$and.push({
      parttime: true
    });
  }
  query.$and.push({
    admin_accept: true
  });
  console.log(param);
  var q = {};
  if (req.user != undefined) {
    q = {
      user_id: req.user._id
    };
  }
  Applicant.find(q, (err, applicants) => {
    var appids = [];
    var unappliedjobs = [];
    applicants.forEach((applicant) => {
      appids.push(String(applicant.job_id));
    });
    Job.find(query, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (req.user != undefined) {
          result.forEach(job => {
            if (appids.includes(String(job._id))) {

            } else {
              unappliedjobs.push(job);
            }
          });
        } else {
          unappliedjobs = result;
        }
        console.log(unappliedjobs);
        res.render('getintern', {
          user: req.user,
          jobs: unappliedjobs,
          parameters: param
        });
      }
    });
  });
});

searchRouter.post('/course', function(req, res, next) {
  var query = {};
  query.$and = [];
  param = {};
  if (req.body.job_category !== '' && req.body.job_category !== undefined && req.body.job_category != 'none') {
    param.job_category = req.body.job_category;
    query.$and.push({
      job_category: req.body.job_category
    });
  }
  query.$and.push({
    admin_accept: true,
    jobtype: 'Course'
  });
  console.log(param);
  var q = {};
  if (req.user != undefined) {
    q = {
      user_id: req.user._id
    };
  }
  Applicant.find(q, (err, applicants) => {
    var appids = [];
    var unappliedjobs = [];
    applicants.forEach((applicant) => {
      appids.push(String(applicant.job_id));
    });
    Job.find(query, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (req.user != undefined) {
          result.forEach(job => {
            if (appids.includes(String(job._id))) {

            } else {
              unappliedjobs.push(job);
            }
          });
        } else {
          unappliedjobs = result;
        }
        res.render('getcourse', {
          user: req.user,
          jobs: unappliedjobs,
          parameters: param
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
