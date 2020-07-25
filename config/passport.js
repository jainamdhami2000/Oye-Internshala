//jshint esversion:6

const localStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../model/user');
const configAuth = require('./auth');

module.exports = function(passport) {

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {

    process.nextTick(function() {
      const username = req.body.username;
      User.findOne({
        'Email': email
      }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.Email = email;
          newUser.Name = username;
          newUser.local.password = newUser.generateHash(password);
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

passport.use('local-login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({
      'Email': username
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

// passport.use(new FacebookStrategy({
//
//     // pull in our app id and secret from our auth.js file
//     clientID: configAuth.facebookAuth.clientID,
//     clientSecret: configAuth.facebookAuth.clientSecret,
//     callbackURL: configAuth.facebookAuth.callbackURL,
//       passReqToCallback: true
//
//   },
//   function(req,token, refreshToken, profile, done) {
//     process.nextTick(function() {
//
//       // find the user in the database based on their facebook id
//       User.findOne({
//         'facebook.id': profile.id
//       }, function(err, user) {
//
//         // if there is an error, stop everything and return that
//         // ie an error connecting to the database
//         if (err)
//           return done(err);
//
//         // if the user is found, then log them in
//         if (user) {
//           return done(null, user,req.flash('message','Login')); // user found, return that user
//         } else {
//           // if there is no user found with that facebook id, create them
//           var newUser = new User();
//
//           // set all of the facebook information in our user model
//           newUser.facebook.id = profile.id; // set the users facebook id
//           newUser.facebook.token = token; // we will save the token that facebook provides to the user
//           newUser.Name = profile.displayName; // look at the passport user profile to see how names are returned
//           newUser.loginType = 'facebook';
//           newUser.IsActive = true;
//           // save our user to the database
//           newUser.save(function(err) {
//             if (err)
//               throw err;
//
//             // if successful, return the new user
//             return done(null, newUser,req.flash('message','Signup'));
//           });
//         }
//
//       });
//     });
//   }));


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
          newUser.FirstName = profile.name;
          newUser.Email = profile.emails[0].value; // pull the first email
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

    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({
        'github.id': profile.id
      }, function(err, user) {
        // return cb(err, user);
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
          newUser.FirstName = profile.username;
          newUser.Email = profile.email; // pull the first email
          newUser.loginType = 'github';
          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser, req.flash('message', 'Signup'));
          });
        }
      });
    }));
  // process.nextTick(function() {
  //   User.findOne({
  //     'github.id': profile.id
  //   }, function(err, user) {
  //     if (err)
  //       return done(err);
  //     if (user) {
  //       // if a user is found, log them in
  //       return done(null, user, req.flash('message', 'Login'));
  //     } else {
  //       // if the user isnt in our database, create a new user
  //       var newUser = new User();
  //
  //       // set all of the relevant information
  //       newUser.github.id = profile.id;
  //       newUser.github.token = accessToken;
  //       newUser.FirstName = profile.username;
  //       newUser.Email = profile.email; // pull the first email
  //       newUser.loginType = 'github';
  //       // save the user
  //       newUser.save(function(err) {
  //         if (err)
  //           throw err;
  //         return done(null, newUser, req.flash('message', 'Signup'));
  //       });
  //     }
  //   });
  // });
// }));
// };
};
