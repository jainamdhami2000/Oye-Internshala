//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Job = require('../model/job');
const User = require('../model/user');

const secret = process.env.jwt_secret;
const authenticateJWT = (req, res, next) => {
  const authHeader = req.session.token;
  if (authHeader) {
    jwt.verify(authHeader, secret, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.redirect('/admin/');
  }
};

router.get('/', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('admin/login', {
    message: req.flash('loginMessage')
  });
});

router.post('/', (req, res) => {
  if (req.body.username == process.env.admin_username && req.body.password == process.env.admin_password) {
    const accessToken = jwt.sign({
      username: req.body.username
    }, secret);
    req.session.token = accessToken;
    console.log(req.session);
    res.redirect('/admin/home');
  } else {
    res.redirect('/admin/');
  }
});

router.get('/home', authenticateJWT, function(req, res) {
  res.render('admin/home.ejs');
});

router.get('/unverifiedemployers', (req, res) => {
  User.find({
    admin_accept: false,
    admin_reject: false
  }, (err, employers) => {
    res.json({
      unverifiedemployers: employers
    });
  });
});

router.post('/unverifiedemployer', (req, res) => {
  var employer_id = req.body.employer_id;
  User.find({
    _id: employer_id
  }, (err, employer) => {
    res.json({
      unverifiedemployer: employer[0]
    });
  });
});

router.post('/employerverification', (req, res) => {
  var accept = req.body.accept;
  var reject = req.body.reject;
  var employer_id = req.body.employer_id;
  User.findOne({
    _id: employer_id
  }, (err, employer) => {
    if (accept) {
      employer.admin_accept = true;
    } else {
      employer.admin_reject = true;
    }
    employer.save();
  });
});

router.get('/unverifiedinternships', (req, res) => {
  Job.find({
    admin_accept: false,
    admin_reject: false,
    jobtype: 'Internship'
  }, (err, internships) => {
    res.json({
      unverifiedinternships: internships
    });
  });
});

router.post('/unverifiedinternship', (req, res) => {
  var job_id = req.body.job_id;
  Job.find({
    _id: job_id
  }, (err, internship) => {
    res.json({
      unverifiedinternship: internship[0]
    });
  });
});

router.post('/internshipverification', (req, res) => {
  var accept = req.body.accept;
  var reject = req.body.reject;
  var job_id = req.body.job_id;
  Job.findOne({
    _id: job_id
  }, (err, job) => {
    if (accept) {
      job.admin_accept = true;
    } else {
      job.admin_reject = true;
    }
    job.save();
  });
});

router.get('/unverifiedjobs', (req, res) => {
  Job.find({
    admin_accept: false,
    admin_reject: false,
    jobtype: 'Job'
  }, (err, jobs) => {
    res.json({
      unverifiedjobs: jobs
    });
  });
});

router.post('/unverifiedjob', (req, res) => {
  var job_id = req.body.job_id;
  Job.find({
    _id: job_id
  }, (err, job) => {
    res.json({
      unverifiedjob: job[0]
    });
  });
});

router.post('/jobverification', (req, res) => {
  var accept = req.body.accept;
  var reject = req.body.reject;
  var job_id = req.body.job_id;
  Job.findOne({
    _id: job_id
  }, (err, job) => {
    if (accept) {
      job.admin_accept = true;
    } else {
      job.admin_reject = true;
    }
    job.save();
  });
});

router.get('/logout', function(req, res) {
  req.session.token = null;
  res.redirect('/admin/');
});

module.exports = router;
