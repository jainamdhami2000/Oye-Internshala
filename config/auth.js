require("dotenv").config();
module.exports = {
  // 'facebookAuth': {
  //   'clientID': '1136276603423895',
  //   'clientSecret': '79d4af7ddadf9c66b492b51f935badbb',
  //   'callbackURL': 'https://api.therecordshouse.com/auth/facebook/callback',
  //   'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
  //   'profileFields': ['id', 'email', 'name']
  // },
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
  'linkedin':{
    'clientID': process.env.LINKEDIN_CLIENT_ID,
    'clientSecret':process.env.LINKEDIN_CLIENT_SECRET,
    'callbackURL': process.env.LINKEDIN_CLIENT_SECRET
  }
};
