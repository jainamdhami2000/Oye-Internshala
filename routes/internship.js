//jshint esversion:8

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

// router.get('/searchintern', isLoggedIn, function(req, res) {
//   if (req.user.isStudent) {
//     Job.find({
//       admin_accept: true
//     }, (err, jobs) => {
//       res.render('getintern', {
//         user: req.user,
//         jobs: jobs
//       });
//     });
//   } else {
//     res.send('Login as Student');
//   }
// });

router.get('/searchintern', isLoggedIn, function(req, res) {
  if (req.user.isStudent) {
    Applicant.find({
      user_id: req.user._id
    }, (err, applicants) => {
      var appids = []
      var unappliedjobs = []
      applicants.forEach((applicant) => {
        appids.push(String(applicant.job_id));
      });
      Job.find({
        admin_accept: true
      }, (err, jobs) => {
        jobs.forEach(job => {
          if (appids.includes(String(job._id))) {

          } else {
            unappliedjobs.push(job)
          }
        })
        console.log(unappliedjobs);
        res.render('getintern', {
          user: req.user,
          jobs: unappliedjobs
        });
      });
    });
  } else {
    res.send('Login as Student');
  }
});

router.get('/postintern', isLoggedIn, (req, res) => {
  if (req.user.isEmployer && req.user.admin_accept) {
    res.render('postinternship', {
      user: req.user
    });
  } else if (req.user.admin_reject) {
    res.send('You are rejected')
  } else if (!req.user.admin_accept && !req.user.admin_reject) {
    res.send('You are unverified')
  } else {
    res.send('Login as Employer')
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

  if (req.user.isStudent) {
    Job.findOne({
      _id: sanitize(req.body.job_id)
    }, (err, job) => {
      User.findOne({
        _id: job.user_id
      }, (err, empuser) => {
        console.log(job);
        if (job) {
          res.render('internship-details', {
            empuser: empuser,
            job: job,
            user: req.user
          });
        } else {
          res.send("Error");
        }
      })
    });
  } else {
    res.send('Login as Student');
  }
});

router.post('/apply', (req, res) => {
  var job_id = sanitize(req.body.job_id);
  Job.findOne({
    _id: job_id
  }, (err, job) => {
    if (job.applicants_accepted > job.intake) {
      console.log(job);
      var application = new Applicant({
        name: req.user.FirstName + ' ' + req.user.LastName,
        college: req.user.CollegeName,
        job_title: job.job_title,
        // resume: Object,
        skills: req.user.BasicSkills,
        is_accept: false,
        is_reject: false,
        user_id: req.user._id,
        company_name: job.company_name,
        job_id: job._id,
      });
      if (job.onsite == true) {
        application.city = job.job_location;
      }
      if (typeof(job.Question1) != "undefined") {
        application.Question1 = sanitize(req.body.question1);
      }
      if (typeof(job.Question2) != "undefined") {
        application.Question2 = sanitize(req.body.question2);
      }
      if (typeof(job.Question3) != "undefined") {
        application.Question3 = sanitize(req.body.question3);
      }
      application.save();
      job.no_of_applicants += 1;
      job.save();
      res.redirect('/internship/confirm');
    } else {
      res.send('Maximum applicants reached');
    }
  });
});

router.post('/intern-details', (req, res) => {
  var job_id = sanitize(req.body.job_id);
  console.log(job_id);
  Job.findOne({
    _id: job_id
  }, (err, job) => {
    console.log(job);
    if (typeof(job.Question1) != 'undefined' || typeof(job.Question2) != 'undefined' || typeof(job.Question3) != 'undefined') {
      res.render('apply', {
        user: req.user,
        job: job
      });
    } else {
      var application = new Applicant({
        name: req.user.FirstName + ' ' + req.user.LastName,
        college: req.user.CollegeName,
        job_title: job.job_title,
        // resume: Object,
        skills: req.user.BasicSkills,
        is_accept: false,
        is_reject: false,
        user_id: req.user._id,
        company_name: job.company_name,
        job_id: job._id,
      });
      if (job.onsite == true) {
        application.city = job.job_location;
      }
      application.save();
      job.no_of_applicants += 1;
      job.save();
      res.redirect('/internship/confirm'); //MAKE APPLICATION POSTED FOR INTERNSHIP PAGE
    }
  });
});

router.get('/confirm', function(req, res) {
  res.render('application-confirm');
});

router.get('/appliedinternship', isLoggedIn, (req, res) => {
  if (req.user.isStudent) {
    Applicant.find({
        user_id: req.user._id
      }, {
        job_id: 1,
        is_accept: 1,
        is_reject: 1,
        company_name: 1,
        job_title: 1,
        applied_on: 1
      },
      async (err, applications) => {
        var result = [];
        var jobids = [];
        var jobs = [];
        var apps = [];
        if (applications.length > 0) {
          applications.forEach((application) => {
            apps.push({
              _id: application._id,
              job_id: application.job_id,
              is_accept: application.is_accept,
              is_reject: application.is_reject,
              company_name: application.company_name,
              job_title: application.job_title,
              applied_on: application.applied_on,
            });
            jobids.push(application.job_id);
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
            console.log(job)
            jobs = job
          });
          var foundjob;
          await apps.forEach(app => {
            foundjob = jobs.filter((job) => {
              console.log(String(app.job_id) == String(job._id))
              return String(app.job_id) == String(job._id);
            });
            console.log('Hello', result)
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
            console.log('Hi', result)
          });

          res.render('studentinternship', {
            user: req.user,
            applications: result,
          });
        } else {
          res.render('studentinternship', {
            user: req.user,
            applications: applications,
          });
        }
      });
  } else {
    res.send('Login as Student');
  }
});

router.get('/postedjobs', isLoggedIn, (req, res) => {
  if (req.user.isEmployer && req.user.admin_accept) {
    Job.find({
      user_id: req.user._id
    }, {
      job_title: 1,
      jobtype: 1,
      job_published: 1,
      applicants_accepted: 1,
      intake: 1
    }, (err, jobs) => {
      // res.json(jobs)
      res.render('postedjobs', {
        user: req.user,
        jobs: jobs
      });
    });
  } else if (req.user.admin_reject) {
    res.send('You are rejected')
  } else if (!req.user.admin_accept && !req.user.admin_reject) {
    res.send('You are unverified')
  } else {
    res.send('Login as Employer')
  }
});

router.post('/jobapplications', (req, res) => {
  var job_id = req.body.job_id;
  Applicant.find({
    job_id: job_id
  }, (err, applicants) => {
    res.render('studentapplications', {
      user: req.user,
      applicants: applicants
    });
  });
});

router.post('/studentapplicationdetails', (req, res) => {
  var applicant_id = req.body.applicant_id;
  Applicant.findOne({
    _id: applicant_id
  }, (err, applicant) => {
    Job.findOne({
      _id: applicant.job_id
    }, (err, job) => {
      res.render('studentapplicationdetails', {
        user: req.user,
        applicant: applicant,
        job: job
      });
    });
  });
});

router.post('/studentapplicationreview', (req, res) => {
  var accept = req.body.accept;
  var reject = req.body.reject;
  var applicant_id = req.body.applicant_id;
  Applicant.findOne({
    _id: applicant_id
  }, (err, applicant) => {
    if (accept == 'Accept') {
      applicant.is_accept = true;
      Job.findOne({
        _id: applicant.job_id
      }, (err, job) => {
        job.applicants_accepted += 1;
        job.save();
      })
    } else {
      applicant.is_reject = true;
    }
    applicant.save();
    res.redirect('/profile/employer');
  });
});

router.post('/viewinternship', (req, res) => {
  var job_id = req.body.job_id;
  Job.findOne({
    _id: job_id
  }, (err, internship) => {
    res.render('viewinternship-e', {
      job: internship,
      user: req.user
    });
  });
})

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
