//jshint esversion:6
require("dotenv").config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});
module.exports = function(email, content) {
  let mail = {
    from: process.env.email,
    to: email,
    subject: 'Verify Mail',
    text: content
  };
  transporter.sendMail(mail, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      console.log('Mail sent successfully');
    }
  });
};
