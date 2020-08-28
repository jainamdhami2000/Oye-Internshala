//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Job = require('../model/job');
const User = require('../model/user');
const Jobtitle = require('../model/jobtitle');

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
    admin_reject: false,
    isVerified: true
  }, (err, employers) => {
    // res.json({
    //     unverifiedemployers: employers
    // });
    res.render('admin/employer-verify', {
      unverifiedemployers: employers
    });
  });
});

router.post('/unverifiedemployer', (req, res) => {
  var employer_id = req.body.employer_id;
  User.findOne({
    _id: employer_id
  }, (err, employer) => {
    // res.json({
    //     unverifiedemployer: employer[0]
    // });
    res.render('admin/emp-details', {
      unverifiedemployer: employer
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
    if (accept == 'Accept') {
      employer.admin_accept = true;
    } else {
      employer.admin_reject = true;
    }
    employer.save();
    res.redirect('/admin/home');
  });
});

router.get('/unverifiedinternships', (req, res) => {
  Job.find({
    admin_accept: false,
    admin_reject: false,
    jobtype: 'Internship'
  }, (err, internships) => {
    res.render('admin/internships', {
      jobs: internships
    });
  });
});

router.post('/unverifiedinternship', (req, res) => {
  var job_id = req.body.job_id;
  Job.findOne({
    _id: job_id
  }, (err, internship) => {
    User.findOne({
      _id: internship.user_id
    }, (err, user) => {
      // res.json({
      //     unverifiedinternship: internship[0]
      // });
      res.render('admin/internship-details', {
        job: internship,
        user: user
      });
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
    if (accept == 'Accept') {
      job.admin_accept = true;
    } else {
      job.admin_reject = true;
    }
    job.save();
    res.redirect('/admin/home');
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
  Job.findOne({
    _id: job_id
  }, (err, job) => {
    res.json({
      unverifiedjob: job
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
    res.redirect('/admin/home');
  });
});

router.get('/addjobtitle', (req, res) => {
  res.render('admin/addjobtitle');
});

router.post('/addjobtitle', (req, res) => {
  Jobtitle.findOne({
    job_category: req.body.job_category
  }, (err, job) => {
    var result;
    if (job == null) {
      result = [];
      var jobtitle = new Jobtitle({
        job_category: req.body.job_category,
      });
      result.push(req.body.job_title);
      jobtitle.job_title = result;
      jobtitle.save();
    } else {
      result = job.job_title;
      result.push(req.body.job_title);
      job.jobtitle = result;
      job.save();
    }
    res.send('Done');
  });
});

router.get('/logout', function(req, res) {
  req.session.token = null;
  res.redirect('/admin/');
});

module.exports = router;
