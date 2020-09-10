//jshint esversion:8

const express = require('express');
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const User = require('../model/user');
const Job = require('../model/job');
const Applicant = require('../model/applicant');

router.get('/', function(req, res) {
  res.render('courses', {
    user: req.user
  });
});

router.get('/searchcourse', isLoggedIn, function(req, res) {
  if (req.user.isStudent) {
    Applicant.find({
      user_id: req.user._id
    }, (err, applicants) => {
      var appids = [];
      var unappliedjobs = [];
      applicants.forEach((applicant) => {
        appids.push(String(applicant.job_id));
      });
      Job.find({
        admin_accept: true,
        jobtype:'Course'
      }, (err, jobs) => {
        jobs.forEach(job => {
          if (appids.includes(String(job._id))) {

          } else {
            unappliedjobs.push(job);
          }
        });
        res.render('getcourse', {
          user: req.user,
          jobs: unappliedjobs,
          parameters: []
        });
      });
    });
  } else {
    res.render('error', {
      user: req.user,
      message: 'Login as Student'
    });
  }
});

router.get('/postcourse', isLoggedIn, (req, res) => {
  if (req.user.isTrainer && req.user.admin_accept) {
    res.render('postcourse', {
      user: req.user
    });
  } else if (req.user.admin_reject) {
    res.render('error', {
      user: req.user,
      message: 'You are rejected'
    });
  } else if (!req.user.admin_accept && !req.user.admin_reject) {
    res.render('error', {
      user: req.user,
      message: 'You are unverified'
    });
  } else {
    res.render('error', {
      user: req.user,
      message: 'Login as Trainer'
    });
  }
});

router.post('/postcourse', isLoggedIn, (req, res) => {
  job = new Job({
    job_title: sanitize(req.body.job_title),
    job_category: sanitize(req.body.job_category),
    job_content: sanitize(req.body.job_content),
    job_duration: sanitize(req.body.job_duration),
    start_date: sanitize(req.body.start_date),
    apply_last: sanitize(req.body.apply_last),
    requirements: sanitize(req.body.requirements),
    course_link: sanitize(req.body.course_link),
    jobtype: 'Course',
    user_id: req.user._id,
    company_name: req.user.CompanyName,
    job_published: Date.now(),
  });
  job.save();
  res.redirect('/');
});

router.get('/postedcourses', isLoggedIn, (req, res) => {
  if (req.user.isTrainer && req.user.admin_accept) {
    Job.find({
      user_id: req.user._id,
      jobtype:'Course'
    }, (err, jobs) => {
      res.render('postedCourses', {
        user: req.user,
        jobs: jobs
      });
    });
  } else if (req.user.admin_reject) {
    res.render('error', {
      user: req.user,
      message: 'You are rejected'
    });
  } else if (!req.user.admin_accept && !req.user.admin_reject) {
    res.render('error', {
      user: req.user,
      message: 'You are unverified'
    });
  } else {
    res.render('error', {
      user: req.user,
      message: 'Login as Trainer'
    });
  }
});

router.post('/view', isLoggedIn, (req, res) => {  //
  if (req.user.isStudent) {
    Job.findOne({
      _id: sanitize(req.body.job_id)
    }, (err, job) => {
      User.findOne({
        _id: job.user_id
      }, (err, empuser) => {
        console.log(job);
        if (job) {
          res.render('course-details', {
            empuser: empuser,
            job: job,
            user: req.user
          });
        } else {
          res.send("Error");
        }
      });
    });
  } else {
    res.render('error', {
      user: req.user,
      message: 'Login as Student'
    });
  }
});

router.post('/apply', isLoggedIn, (req, res) => {
  var job_id = sanitize(req.body.job_id);
  Job.findOne({
    _id: job_id
  }, (err, job) => {
    var application = new Applicant({
      name: req.user.FirstName + ' ' + req.user.LastName,
      college: req.user.CollegeName,
      job_category: req.body.job_category,
      job_title: job.job_title,
      user_id: req.user._id,
      company_name: job.company_name,
      job_id: job._id,
      isCourse: true
    });
    application.save();
    job.no_of_applicants += 1;
    job.save();
    res.redirect('/internship/confirm');
  });
});

router.get('/appliedcourse', isLoggedIn, (req, res) => {
  if (req.user.isStudent) {
    Applicant.find({
        user_id: req.user._id
      },
      async (err, applications) => {
        var result = [];
        var jobids = [];
        var jobs = [];
        var apps = [];
        if (applications.length > 0) {
          applications.forEach((application) => {
            if(application.isCourse){
              apps.push(application);
              jobids.push(application.job_id);
            }
          });
          await Job.find({
            _id: {
              $in: jobids
            }
          }, {
            _id: 1,
            no_of_applicants: 1,
            jobtype: 1
          }, (err, job) => {
            job.forEach(j=>{
              if (j.jobtype=='Course'){
                jobs.push(j);
              }
            });
          });
          var foundjob;
          await apps.forEach(app => {
            foundjob = jobs.filter((job) => {
              return String(app.job_id) == String(job._id);
            });
            result.push({
              _id: app._id,
              job_id: app.job_id,
              is_accept: app.is_accept,
              is_reject: app.is_reject,
              company_name: app.company_name,
              job_title: app.job_title,
              applied_on: app.applied_on,
              job_type: foundjob[0].jobtype,
              no_of_applicants: foundjob[0].no_of_applicants
            });
          });
          res.render('studentcourses', {
            user: req.user,
            applications: result,
          });
        } else {
          res.render('studentcourses', {
            user: req.user,
            applications: applications,
          });
        }
      });
  } else {
    res.render('error', {
      user: req.user,
      message: 'Login as Student'
    });
  }
});

router.post('/viewcourse', isLoggedIn, (req, res) => {  //trainer side se view posted courses
  var job_id = req.body.job_id;
  Job.findOne({
    _id: job_id,
  }, (err, internship) => {
    res.render('viewcourse-e', {
      job: internship,
      user: req.user
    });
  });
});

router.post('/editcourseview', isLoggedIn, (req, res) => {
  var job_id = req.body.job_id;
  Job.findOne({
    _id: job_id
  }, (err, course) => {
    res.render('editcourse', {
      internship: course,
      user: req.user
    });
  });
});

router.post('/editintership', isLoggedIn, (req, res) => {
  Job.findOneAndUpdate({
    _id: req.body.job_id
  }, {
    "$set": {
      'job_category': req.body.job_category,
      'job_title': req.body.job_title,
      'job_content': req.body.job_content,
      'job_duration': req.body.job_duration,
      'start_date': req.body.start_date,
      'apply_last': req.body.apply_last,
      'requirements': req.body.requirements,
    }
  }, {
    new: true
  }, function(err, doc) {
    if (err) {
      console.log(err);
      // return returnErr(res, "Error", "Our server ran into an error please try again")
    }
  });
  Applicant.findOneAndUpdate({
    user_id: req.user._id
  }, {
    '$set': {
      'job_category': req.body.job_category,
      'job_title': req.body.job_title,
    }
  }, {
    new: true
  }, function(err, doc) {
    if (err) {
      console.log(err);
      // return returnErr(res, "Error", "Our server ran into an error please try again")
    }
  });
  res.redirect('/profile/trainer');
});

router.post('/deletecourse', isLoggedIn, (req, res) => {
  Applicant.deleteMany({
    job_id: req.body.job_id
  }, (err, doc) => {
    if (err) {
      console.log(err);
      // return returnErr(res, "Error", "Our server ran into an error please try again")
    }
  });
  Job.deleteMany({
    _id: req.body.job_id
  }, (err, doc) => {
    if (err) {
      console.log(err);
      // return returnErr(res, "Error", "Our server ran into an error please try again")
    }
  });
  res.redirect('/profile/trainer');
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
