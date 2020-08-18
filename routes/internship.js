//jshint esversion:6

const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const User = require('../model/user');
const Job = require('../model/job');

router.get('/', function(req, res) {
  res.render('intern-homepage', {
    user: req.user
  });
});

router.get('/searchintern', isLoggedIn, function(req, res) {
  if (req.user.isStudent) {
    Job.find({}, (err, jobs) => {
      res.render('getintern', {
        user: req.user,
        jobs: jobs
      });
    });
  } else {
    res.send('Login as Student');
  }
});

router.get('/postintern', isLoggedIn, (req, res) => {
  if (req.user.isEmployer) {
    res.render('postinternship', {
      user: req.user
    });
  } else {
    res.send('Login as Employer');
  }
});

router.post('/postintern', isLoggedIn, (req, res) => {
  try {
    var job = new Job({
      job_title: sanitize(req.body.job_title),
      job_content: sanitize(req.body.job_content),
      job_duration: sanitize(req.body.job_duration),
      start_date: sanitize(req.body.start_date),
      apply_last: sanitize(req.body.apply_last),
      requirements: sanitize(req.body.requirements),
      intake: sanitize(req.body.intake),
      jobtype: 'Internship',
      user_id: req.user._id,
      company_name: req.user.CompanyName,
      job_published: Date.now(),
    });
    if (req.body.paid == 'on') {
      job.paid = true;
      job.job_stipened = sanitize(req.body.job_stipened);
    }
    if (req.body.onsite == 'on') {
      job.onsite = true;
      job.job_location = sanitize(req.body.job_location);
    }
    job.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.post('/view', isLoggedIn, (req, res) => {
  if (req.user.isStudent) {
    Job.find({
      _id: sanitize(req.body.job_id)
    }, (err, job) => {
      if (job) {
        res.json({
          job: job
        });
      } else {
        res.send("Error");
      }
    });
  } else {
    res.send('Login as Student');
  }
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
module.exports = router;
