//jshint esversion:6

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('intern-homepage');
});

router.get('/searchintern',function (req,res){
  res.render('getintern',{
    user: req.user
  });
});

module.exports = router;
