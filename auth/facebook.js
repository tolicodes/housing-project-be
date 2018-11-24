const passport = require('passport');
const FacebookStrategy = require('passport-facebook')

const {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    APP_ROOT,
} = process.env;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${APP_ROOT}/users/facebook/callback`
  }, (accessToken, refreshToken, profile, cb) => {
      console.log(profile)
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));