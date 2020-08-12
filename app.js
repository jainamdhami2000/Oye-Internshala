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
const configDB = require('./config/database');
const verifymail = require('./routes/verifymail');
const admin = require('./routes/admin');
const internship = require('./routes/internship');
const courses = require('./routes/courses');

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

app.get('/profile-emp', function(req, res) {
  res.render('profile_emp');
});

app.listen(3000, function(err) {
  console.log('Server started on 3000');
});
