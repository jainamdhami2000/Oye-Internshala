//jshint esversion:6

const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const User = require('../model/user');
const Job = require('../model/job');
const Applicant = require('../model/applicant');

router.get('/', function(req, res) {
  res.render('intern-homepage', {
    user: req.user
  });
});

router.get('/searchintern', isLoggedIn, function(req, res) {
  if (req.user.isStudent) {
    Job.find({
      admin_accept: true
    }, (err, jobs) => {
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
    if (req.body.question1 != "") {
      job.Question1 = sanitize(req.body.question1);
    }
    if (req.body.question2 != "") {
      job.Question2 = sanitize(req.body.question2);
    }
    if (req.body.question3 != "") {
      job.Question3 = sanitize(req.body.question3);
    }
    job.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.post('/view', isLoggedIn, (req, res) => {
  console.log(req.body.job_id);
  if (req.user.isStudent) {
    Job.find({
      _id: sanitize(req.body.job_id)
    }, (err, job) => {
      console.log(job);
      if (job) {
        res.render('internship-details', {
          user: req.user,
          job: job[0]
        });
      } else {
        res.send("Error");
      }
    });
  } else {
    res.send('Login as Student');
  }
});

router.post('/apply', (req, res) => {
  var job_id = sanitize(req.body.job_id);
  console.log(job_id)
  Job.find({
    _id: job_id
  }, (err, job) => {
    console.log(job);
    var application = new Applicant({
      name: req.user.FirstName + ' ' + req.user.LastName,
      college: req.user.CollegeName,
      // resume: Object,
      skills: req.user.BasicSkills,
      is_accept: false,
      is_reject: false,
      user_id: req.user._id,
      company_name: job[0].company_name,
      job_id: job[0]._id,
    });
    if (job[0].onsite == true) {
      application.city = job[0].job_location;
    }
    if (typeof(job[0].Question1) != "undefined") {
      application.Question1 = sanitize(req.body.question1);
    }
    if (typeof(job[0].Question2) != "undefined") {
      application.Question2 = sanitize(req.body.question2);
    }
    if (typeof(job[0].Question3) != "undefined") {
      application.Question3 = sanitize(req.body.question3);
    }
    application.save();
    res.redirect('/internship/confirm');
  });
});

router.post('/intern-details', (req, res) => {
  var job_id = sanitize(req.body.job_id);
  console.log(job_id);
  Job.find({
    _id: job_id
  }, (err, job) => {
    console.log(job);
    if (typeof(job[0].Question1) != 'undefined' || typeof(job[0].Question2) != 'undefined' || typeof(job[0].Question3) != 'undefined') {
      res.render('apply', {
        user: req.user,
        job: job[0]
      });
    } else {
      var application = new Applicant({
        name: req.user.FirstName + ' ' + req.user.LastName,
        college: req.user.CollegeName,
        // resume: Object,
        skills: req.user.BasicSkills,
        is_accept: false,
        is_reject: false,
        user_id: req.user._id,
        company_name: job[0].company_name,
        job_id: job[0]._id,
      });
      if (job[0].onsite == true) {
        application.city = job[0].job_location;
      }
      application.save();
      res.redirect('/internship/confirm'); //MAKE APPLICATION POSTED FOR INTERNSHIP PAGE
    }
  });
});

router.get('/confirm', function(req, res) {
  res.render('application-confirm');
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
