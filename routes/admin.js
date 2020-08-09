//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('login-admin', {
    message: req.flash('loginMessage')
  });
});

router.post('/', function(req, res) {
  if (req.body.username == process.env.admin_username && req.body.password == process.env.admin_password)
    res.redirect('/admin/home');
  else
    res.redirect('/admin');
});

router.get('/home', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('adminhome');
});

module.exports = router;
