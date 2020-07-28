//jshint esversion:6

const User = require('../model/user');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      user: req.user
    });
  });

  app.get('/signup2-stud', function(req, res) {
    res.render('signup2-stud', {
      user: req.user,
      message: req.flash('signupMessage')
    });
  });

  app.get('/signup2-emp', function(req, res) {
    res.render('signup2-emp', {
      user: req.user,
      message: req.flash('signupMessage')
    });
  });

  app.get('/signup2-ngo', function(req, res) {
    res.render('signup2-ngo', {
      user: req.user,
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup2-stud', function(req, res) {
    User.findOne({
      _id: req.user._id
    }, function(err, newUser) {
      newUser.CollegeName = req.body.college_name;
      if (req.user.Email == null) {
        newUser.Email = req.body.email;
      }
      newUser.City = req.body.city;
      newUser.save();
    });
    res.redirect('/profile');
  });

  app.post('/signup2-emp', function(req, res) {
    User.findOne({
      _id: req.user._id
    }, function(err, newUser) {
      newUser.CollegeName = req.body.college_name;
      if (req.user.Email == null) {
        newUser.Email = req.body.email;
      }
      newUser.City = req.body.city;
      newUser.save();
    });
    res.redirect('/profile');
  });

  app.post('/signup2-ngo', function(req, res) {
    User.findOne({
      _id: req.user._id
    }, function(err, newUser) {
      newUser.CollegeName = req.body.college_name;
      if (req.user.Email == null) {
        newUser.Email = req.body.email;
      }
      newUser.City = req.body.city;
      newUser.save();
    });
    res.redirect('/profile');
  });

  app.get('/login-stud', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login-stud', {
      message: req.flash('loginMessage')
    });
  });

  app.get('/login-emp', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login-emp', {
      message: req.flash('loginMessage')
    });
  });

  app.get('/login-ngo', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login-ngo', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login-stud', passport.authenticate('local-login-stud', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login-stud', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.post('/login-emp', passport.authenticate('local-login-emp', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login-emp', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.post('/login-ngo', passport.authenticate('local-login-ngo', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login-ngo', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/signup-stud', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup-stud', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/signup-emp', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup-emp', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/signup-ngo', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup-ngo', {
      message: req.flash('signupMessage')
    });
  });


  app.post('/signup-stud', passport.authenticate('local-signup-stud', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup-stud', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.post('/signup-emp', passport.authenticate('local-signup-emp', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup-emp', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.post('/signup-ngo', passport.authenticate('local-signup-ngo', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup-ngo', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // app.get('/verify', function(req, res) {
  //   User.findOne({
  //     'local.email': req.user.local.email
  //   }, function(err, user) {
  //     if (user.local.isVerified) {
  //       res.redirect('/');
  //     } else {
  //       res.render('verify.ejs', {
  //         user: req.user // get the user out of session and pass to template
  //       });
  //     }
  //   });
  // });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      // successRedirect: '/profile',
      failureRedirect: '/login-stud'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      if (req.flash('message') == 'Login') {
        res.redirect('/profile');
      } else {
        res.redirect('/signup2-stud');
      }
    });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  // the callback after google has authenticated the user
  app.get('/auth/google/oye-internshala',
    passport.authenticate('google', {
      // successRedirect: '/profile',
      failureRedirect: '/login-stud'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      if (req.flash('message') == 'Login') {
        res.redirect('/profile');
      } else {
        res.redirect('/signup2-stud');
      }
    });

  app.get('/auth/github', passport.authenticate('github', {
    scope: ['profile', 'user:email']
  }));

  // the callback after github has authenticated the user
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      // successRedirect: '/profile',
      failureRedirect: '/login-stud'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      if (req.flash('message') == 'Login') {
        res.redirect('/profile');
      } else {
        res.redirect('/signup2-stud');
      }
    });

  app.get('/auth/linkedin', passport.authenticate('linkedin'));

  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    // successRedirect: '/profile',
    failureRedirect: '/login-stud'
  }), function(req, res) {
    // Successful authentication, redirect home.
    if (req.flash('message') == 'Login') {
      res.redirect('/profile');
    } else {
      res.redirect('/signup2-stud');
    }
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.isLogged = true;
    return next();
  }
  res.redirect('/');
}
