//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('courses', {
    user: req.user
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

module.exports = router;
