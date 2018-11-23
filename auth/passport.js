const passport = require('passport');
const LocalStrategy = require('passport-local');

const {
  Users
} = require('../models');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  const user  = await Users.find({
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