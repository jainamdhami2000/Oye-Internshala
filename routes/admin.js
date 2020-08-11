//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

router.get('/home',authenticateJWT, function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('admin/home.ejs');
});

router.get('/logout', function(req, res) {
  req.session.token = null;
  res.redirect('/admin/');
});

module.exports = router;
