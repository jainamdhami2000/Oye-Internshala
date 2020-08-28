//jshint esversion:6

const express = require('express');
const sanitize = require('mongo-sanitize');
const searchRouter = express.Router();
const Job = require('../model/job');

searchRouter.post('/main', function(req, res, next) {
  var q = req.body.searchInput;
  var query = {};
  query.$and = [];
  if (typeof(req.body.job_category) !== 'undefined') {
    query.$and.push({
      job_category: req.body.job_category
    });
  }
  if (typeof(req.body.job_title) !== 'undefined') {
    query.$and.push({
      job_title: req.body.job_title
    });
  }
  if (typeof(req.body.job_location) !== 'undefined') {
    query.$and.push({
      job_location: req.body.job_location
    });
  }
  if (typeof(req.body.home) !== false) {
    query.$and.push({
      onsite: false
    });
  }
  if (typeof(req.body.start_date) !== 'undefined') {
    query.$and.push({
      apply_last: {
        $gte: req.body.start_date
      }
    });
  }
  Job.find(query, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (typeof(req.body.isAjax) !== 'undefined') {
        //Render the page
        res.json(result);
      } else {
        res.json(result);
      }
    }
  });
});

module.exports = searchRouter;
