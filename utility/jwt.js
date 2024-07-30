const jwt = require('jsonwebtoken');
require('dotenv').config();

const createJwt = ({ payload }) => {
  const userToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return userToken;
};

const isTokenValid = ({ token }) => {
  console.log('TOOKEN HERE');
  console.log(token);

  const value = jwt.verify(token, process.env.JWT_SECRET);

  return value;
};

const attachCookieToResponse = ({ res, user }) => {
  const token = createJwt({ payload: user });

  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
  });
};

module.exports = { isTokenValid, createJwt, attachCookieToResponse };
