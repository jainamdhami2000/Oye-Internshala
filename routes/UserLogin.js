//jshint esversion:6

const User = require('../model/user');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      user: req.user
    });
  });

  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/verify', function(req, res) {
    User.findOne({
      'local.email': req.user.local.email
    }, function(err, user) {
      if (user.local.isVerified) {
        res.redirect('/');
      } else {
        res.render('verify.ejs', {
          user: req.user // get the user out of session and pass to template
        });
      }
    });
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  //
  // app.get('/auth/facebook', passport.authenticate('facebook', {
  //     scope: ['email']
  // }));
  // app.get('/auth/facebook/callback',
  //     passport.authenticate('facebook', {
  //         successRedirect: '/',
  //         failureRedirect: '/login'
  //     }));

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  // the callback after google has authenticated the user
  app.get('/auth/google/oye-internshala',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }));
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.isLogged = true;
    return next();
  }
  res.redirect('/');
}
