//jshint esversion:6

require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

const mail = require('../utils/mailer');
const User = require('../model/user');
// const {
//   myFirebase,
//   myFirestore
// } = require('../config/firebaseNormal');

//handling post request from signup page (registerandlogin.js)
router.post('/verifyMail', function(req, res) {
  var secret = process.env.email_secret;
  //checking for existing mail in database
  if (req.body.email !== '') {
    User.findOne({
      Email: req.body.email
    }, function(err, result) {
      if (err) {
        console.log(err);
      }
      if (result == null) {
        res.send('Email not found');
      } else {
        const emailAddress = req.body.email;
        // console.log(result._id)
        var date = Date.now();
        date += (24 * 60 * 60 * 1000);
        const payload = {
          id: result._id,
          email: emailAddress,
          endDate: date
        };
        var token = jwt.encode(payload, secret);
        // let content = 'http://'+ip+':'+port+'/user/resetpassword/'+payload.id+'/'+token
        //For locally uncomment this
        let content = 'http://localhost:3000/verify/verifyMail/' + payload.id + '/' + token;
        mail(emailAddress, content);
        res.send('Mail Sent Successfully');
        val = true;
      }
    });
  } else {
    res.send('Enter an email');
  }
});
//handling the link clicked on receiving the confirmation mail
router.get('/verifyMail/:id/:token', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  var payload = jwt.decode(req.params.token, secret);
  // user.findOneAndUpdate({_id:payload.id}, { isVerified: true });
  if (payload.endDate < Date.now()) {
    res.send('INVALID LINK');
  } else {
    User.findById(payload.id, function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (result == null) {
        res.send('INCORRECT');
      } else {
        result.isVerified = true;
        result.save();
        res.redirect('/');
      }
    });
  }
});

// router.get('/addToChat', function(req, res) {
//   myFirestore
//     .collection('users')
//     .doc(String(req.user._id))
//     .set({
//       id: String(req.user._id),
//       nickname: req.user.local.username,
//       contacts: []
//     })
//     .then(data =>
//       console.log(data));
//   res.render('profile.ejs', {
//     user: req.user
//   });
// });

module.exports = router;
