// jshint esversion:6

require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const session = require('express-session');
const http = require('http');
const sanitize = require('mongo-sanitize');
const configDB = require('./config/database');
const verifymail = require('./routes/verifymail');
const admin = require('./routes/admin');
const internship = require('./routes/internship');
const courses = require('./routes/courses');
const profile = require('./routes/profile');
const search = require('./routes/searchRoute');

mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require('./config/passport')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/UserLogin')(app, passport);

// Routes

app.use('/verify', verifymail);
app.use('/admin', admin);
app.use('/internship', internship);
app.use('/courses', courses);
app.use('/profile', profile);
app.use('/search', search);

// app.get('/profile-emp', function(req, res) {
//   res.render('profile_emp');
// });
//
// app.get('/profile-ngo', function(req, res) {
//   res.render('profile_ngo');
// });

// app.get('/profile-stud', function(req, res) {
//   res.render('profile_stud');
// });

// app.get('/hi', function(req, res) {
//     if (req.user.isStudent) {
//       Job.find({
//         admin_accept: false,
//       }, (err, jobs) => {
//         res.render('getintern', {
//           user: req.user,
//           jobs: jobs
//         });
//       });
//     } else {
//       res.send('Login as Student');
//     };
// });

app.get('/hi', function(req, res) {
  res.render('admin/internship-details');
});
app.get('/hi2', function(req, res) {
  res.render('studentsApplied');
});
app.get('/hi3', function(req, res) {
  res.render('studAppliedDetails');
});

app.listen(3000, function(err) {
  console.log('Server started on 3000');
});
