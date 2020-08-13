//jshint esversion:6

const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Job = require('../model/job');

router.get('/', function(req, res) {
  res.render('intern-homepage', {
    user: req.user
  });
});

router.get('/searchintern', function(req, res) {
  res.render('getintern', {
    user: req.user
  });
});

router.get('/postintern', (req, res) => {
  res.render('postinternship', {
    user: req.user
  });
});

router.post('/postintern', (req, res) => {
  try {
    var job = new Job({
      job_title: req.body.job_title,
      job_content: req.body.job_content,
      job_duration: req.body.job_duration,
      start_date: req.body.start_date,
      apply_last: req.body.apply_last,
      requirements: req.body.requirements,
      intake: req.body.intake,
      jobtype: 'Internship',
      user_id: req.user._id,
      company_name: req.user.CompanyName,
      job_published: Date.now(),
    });
    if (req.body.paid == 'on') {
      job.paid = true;
      job.job_stipened = req.body.job_stipened;
    }
    if (req.body.onsite == 'on') {
      job.onsite = true;
      job.job_location = req.body.job_location;
    }
    job.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }

});
module.exports = router;
