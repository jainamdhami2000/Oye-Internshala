require("dotenv").config();
module.exports = {
  'facebookAuth': {
    'clientID': process.env.FACEBOOK_CLIENT_ID,
    'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
    'callbackURL': process.env.FACEBOOK_CALLBACK_URL,
    'profileFields': ['id', 'email', 'name']
  },
  'googleAuth': {
    'clientID': process.env.GOOGLE_CLIENT_ID,
    'clientSecret': process.env.GOOGLE_CLIENT_SECRET,
    'callbackURL': process.env.GOOGLE_CALLBACK_URL
  },
  'githubAuth':{
    'clientID': process.env.GITHUB_CLIENT_ID,
    'clientSecret':process.env.GITHUB_CLIENT_SECRET,
    'callbackURL': process.env.GITHUB_CALLBACK_URL
  },
  'linkedinAuth':{
    'clientID': process.env.LINKEDIN_CLIENT_ID,
    'clientSecret':process.env.LINKEDIN_CLIENT_SECRET,
    'callbackURL': process.env.LINKEDIN_CALLBACK_URL
  },
};
