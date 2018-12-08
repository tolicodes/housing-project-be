
const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const jwtAuthOptions = {
  secret: 'secret',
  userProperty: 'user',
  getToken: getTokenFromHeaders,
};

const auth = {
  required: jwt(jwtAuthOptions),
  optional: jwt({
    ...jwtAuthOptions,
    credentialsRequired: false,
  }),
  admin: (req) => {
    console.log(req)
  }
};

module.exports = auth;