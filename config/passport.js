//jshint esversion:6

const localStrategy_stud = require('passport-local').Strategy;
const localStrategy_trainer = require('passport-local').Strategy;
const localStrategy_emp = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const sanitize = require('mongo-sanitize');
const User = require('../model/user');
const configAuth = require('./auth');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    if (file.mimetype === 'application/pdf') {
      callback(null, './uploads');
    } else {
      callback(new Error('file type not supported'), false);
    }
  },
  filename: function(req, file, callback) {
    if (file.mimetype === 'application/pdf') {
      callback(null, file.fieldname + '-' + Date.now() + '.pdf');
    } else {
      callback(new Error('file type not supported'), false);
    }
  }
});
var upload = multer({
  storage: storage
});

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup-trainer', new localStrategy_trainer({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      process.nextTick(function() {
        const username = sanitize(req.body.username);
        User.findOne({
          'Email': email,
          isTrainer: true
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            admin_accept = false;
            admin_reject = false;
            var newUser = new User();
            newUser.Email = email;
            newUser.FirstName = sanitize(req.body.fname);
            newUser.LastName = sanitize(req.body.lname);
            newUser.username = username;
            newUser.isTrainer = true;
            newUser.CompanyName = sanitize(req.body.company_name);
            newUser.phoneNumber = sanitize(req.body.phoneno);
            newUser.City = sanitize(req.body.city);
            newUser.admin_accept = admin_accept;
            newUser.admin_reject = admin_reject;
            newUser.local.password = newUser.generateHash(password);
            newUser.loginType = 'local';
            newUser.DateofBirth = sanitize(req.body.birthdate);
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-signup-stud', new localStrategy_stud({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      process.nextTick(function() {
        const username = sanitize(req.body.username);
        User.findOne({
          'Email': email,
          isStudent: true
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            const file = req.file;
            if (!file) {
              const error = new Error('Please upload a file');
              error.httpStatusCode = 400;
              return next(error);
            }
            var newUser = new User();
            newUser.Email = email;
            newUser.FirstName = sanitize(req.body.fname);
            newUser.LastName = sanitize(req.body.lname);
            newUser.username = username;
            newUser.BasicSkills = sanitize(req.body.skills);
            newUser.CollegeName = sanitize(req.body.college_name);
            newUser.City = sanitize(req.body.city);
            newUser.isStudent = true;
            newUser.local.password = newUser.generateHash(password);
            newUser.loginType = 'local';
            newUser.DateofBirth = sanitize(req.body.birthdate);
            newUser.resume = file;
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-signup-emp', new localStrategy_emp({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      process.nextTick(function() {
        const username = sanitize(req.body.username);
        User.findOne({
          'Email': email,
          isEmployer: true
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            admin_accept = false;
            admin_reject = false;
            var newUser = new User();
            newUser.Email = email;
            newUser.FirstName = sanitize(req.body.fname);
            newUser.LastName = sanitize(req.body.lname);
            newUser.username = username;
            newUser.isEmployer = true;
            newUser.CompanyDescription = sanitize(req.body.company_description);
            newUser.CompanyName = sanitize(req.body.company_name);
            newUser.phoneNumber = sanitize(req.body.phoneno);
            newUser.admin_accept = admin_accept;
            newUser.admin_reject = admin_reject;
            newUser.MainOfficeLocation = sanitize(req.body.city);
            newUser.local.password = newUser.generateHash(password);
            newUser.DateofBirth = sanitize(req.body.birthdate);
            newUser.loginType = 'local';
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-login-trainer', new localStrategy_trainer({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({
        'Email': username,
        isTrainer: true
      }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        return done(null, user);
      });
    }));

  passport.use('local-login-stud', new localStrategy_stud({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({
        'Email': username,
        isStudent: true
      }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        return done(null, user);
      });
    }));

  passport.use('local-login-emp', new localStrategy_emp({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({
        'Email': username,
        isEmployer: true
      }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        return done(null, user);
      });
    }));

  passport.use(new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields:configAuth.facebookAuth.profileFields,
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
      process.nextTick(function() {
        // find the user in the database based on their facebook id
        User.findOne({
          'facebook.id': profile.id
        }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);
          // if the user is found, then log them in
          if (user) {
            return done(null, user, req.flash('message', 'Login')); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            // set all of the facebook information in our user model
            newUser.facebook.id = profile.id; // set the users facebook id
            newUser.facebook.token = token; // we will save the token that facebook provides to the user
            newUser.loginType = 'facebook';
            // newUser.IsActive = true;
            // console.log(profile)
            // name = profile.displayName.split(' ', 2);
            // fname = name[0];
            // lname = name[1];
            newUser.FirstName = profile.name.givenName;
            newUser.LastName = profile.name.familyName;
            newUser.isVerified = true;
            newUser.isStudent = true;
            newUser.DateofBirth = req.body.birthdate;
            if (typeof(profile.username) == 'undefined') {
              newUser.username = profile.name.givenName + profile.name.familyName;
            } else {
              newUser.username = profile.username; // look at the passport user profile to see how names are returned
            }
            if (profile.hasOwnProperty('emails')) {
              newUser.Email = profile.emails[0].value;
            } else {
              newUser.Email = null;
            }
            // newUser.Email = profile.emails[0].value; // pull the first email
            // newUser.username = profile.emails[0].value.substr(0, profile.emails[0].value.indexOf('@'));
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
              // if successful, return the new user
              return done(null, newUser, req.flash('message', 'Signup'));
            });
          }
        });
      });
    }));

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function() {
        // try to find the user based on their google id
        User.findOne({
          'google.id': profile.id
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            // if a user is found, log them in
            return done(null, user, req.flash('message', 'Login'));
          } else {
            // if the user isnt in our database, create a new user
            var newUser = new User();
            // set all of the relevant information
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.FirstName = profile.name.givenName;
            newUser.LastName = profile.name.familyName;
            newUser.isVerified = true;
            newUser.isStudent = true;
            newUser.DateofBirth = sanitize(req.body.birthdate);
            newUser.Email = profile.emails[0].value; // pull the first email
            newUser.username = profile.emails[0].value.substr(0, profile.emails[0].value.indexOf('@'));
            newUser.loginType = 'google';
            // save the user
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser, req.flash('message', 'Signup'));
            });
          }
        });
      });
    }));

  passport.use(new GitHubStrategy({
      clientID: configAuth.githubAuth.clientID,
      clientSecret: configAuth.githubAuth.clientSecret,
      callbackURL: configAuth.githubAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({
          'github.id': profile.id
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            // if a user is found, log them in
            return done(null, user, req.flash('message', 'Login'));
          } else {
            // if the user isnt in our database, create a new user
            var newUser = new User();
            // set all of the relevant information
            newUser.github.id = profile.id;
            newUser.github.token = accessToken;
            if (profile.displayName == null) {
              newUser.FirstName = profile.username;
              newUser.LastName = '';
            } else {
              name = profile.displayName.split(' ', 2);
              fname = name[0];
              lname = name[1];
              newUser.FirstName = fname;
              newUser.LastName = lname;
            }
            newUser.isVerified = true;
            newUser.isStudent = true;
            newUser.DateofBirth = sanitize(req.body.birthdate);
            if (profile._json.email == null) {
              newUser.Email = null;
            } else {
              newUser.Email = profile.emails[0].value;
            }
            newUser.username = profile.username;
            newUser.loginType = 'github';
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser, req.flash('message', 'Signup'));
            });
          }
        });
      });
    }));

  passport.use(new LinkedInStrategy({
    clientID: configAuth.linkedinAuth.clientID,
    clientSecret: configAuth.linkedinAuth.clientSecret,
    callbackURL: configAuth.linkedinAuth.callbackURL,
    scope: ['r_emailaddress', 'r_liteprofile'],
    state: true,
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.
      User.findOne({
        'linkedin.id': profile.id
      }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          // if a user is found, log them in
          return done(null, user, req.flash('message', 'Login'));
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new User();
          // set all of the relevant information
          newUser.linkedin.id = profile.id;
          newUser.linkedin.token = accessToken;
          newUser.FirstName = profile.name.givenName;
          newUser.LastName = profile.name.familyName;
          newUser.isVerified = true;
          newUser.DateofBirth = sanitize(req.body.birthdate);
          newUser.isStudent = true;
          if (profile.emails[0].value == null) {
            newUser.Email = null;
            newUser.username = profile.name.givenName + profile.name.familyName;
          } else {
            newUser.Email = profile.emails[0].value; // pull the first email
            newUser.username = profile.emails[0].value.substr(0, profile.emails[0].value.indexOf('@'));
          }
          newUser.loginType = 'linkedin';
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser, req.flash('message', 'Signup'));
          });
        }
      });
    });
  }));
};
