//jshint esvesion:6

const express = require('express');
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const Job = require('../model/job');
const User = require('../model/user');
const Applicant = require('../model/applicant');

router.get('/student', isLoggedIn, function(req, res) {
  res.render('profile_stud.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

router.get('/employer', isLoggedIn, function(req, res) {
  res.render('profile_emp.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

router.get('/updatestudent', isLoggedIn, (req, res) => {
  res.render('editstudent', {
    user: req.user
  })
});

router.post('/updatestudent', (req, res) => {
  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    "$set": {
      'username': req.body.username,
      'FirstName': req.body.fname,
      'LastName': req.body.lname,
      'CollegeName': req.body.college_name,
      'BasicSkills': req.body.skills,
      'City': req.body.city,
    }
  }, {
    new: true
  }, function(err, doc) {
    if (err) {
      console.log(err);
      // return returnErr(res, "Error", "Our server ran into an error please try again")
    }
    req.user = doc;
  });
  res.redirect('/profile/student');
});

router.get('/updateemployer', isLoggedIn, (req, res) => {
  res.render('editemployer', {
    user: req.user
  })
});

router.post('/updateemployer', (req, res) => {
  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    "$set": {
      'username': req.body.username,
      'FirstName': req.body.fname,
      'LastName': req.body.lname,
      'phoneNumber': req.body.phoneno,
      'CompanyName': req.body.company_name,
      'CompanyDescription': req.body.company_description,
      'MainOfficeLocation': req.body.city,
    }
  }, {
    new: true
  }, function(err, doc) {
    if (err) {
      console.log(err);
      // return returnErr(res, "Error", "Our server ran into an error please try again")
    }
    req.user = doc;
  });
  res.redirect('/profile/employer');
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
