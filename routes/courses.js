//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('courses', {
    user: req.user
  });
});

module.exports = router;
