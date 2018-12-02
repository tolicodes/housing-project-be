const passport = require('passport');
const LocalStrategy = require('passport-local');
const { Strategy: LinkedInStrategy } = require('passport-linkedin');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy: FacebookStrategy } = require('passport-facebook');

const models = require('../models');

const PROVIDER_MAP = {
  'facebook': 'fb_id',
  'linkedin': 'li_id',
  'google': 'google_id',
};


const {
  APP_ROOT,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
} = process.env;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  const user = await models.user.findOne({
    where: {
      email
    }
  });

  if (!user || !user.validatePassword(password)) {
    return done(null, false, {
      errors: {
        'email or password': 'is invalid'
      }
    });
  }

  return done(null, user);

}));

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

const onSocialLoginSuccess = provider => async (accessToken, refreshToken, profile, cb) => {
  const user = await models.user.findOne({
    where: {
      [PROVIDER_MAP[provider]]: profile.id
    }
  })

  cb(null, {
    ...profile,
    exists: !!user
  });
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: APP_ROOT + '/users/google/callback'
}, onSocialLoginSuccess('google')));

passport.use(new LinkedInStrategy({
  consumerKey: LINKEDIN_CLIENT_ID,
  consumerSecret: LINKEDIN_CLIENT_SECRET,
  callbackURL: APP_ROOT + '/users/linkedin/callback'
}, onSocialLoginSuccess('linkedin')))

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: APP_ROOT + '/users/facebook/callback'
}, onSocialLoginSuccess('facebook')))
