const jwt = require('jsonwebtoken');
require('dotenv').config();

const createJwt = ({ payload }) => {
  const userToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return userToken;
};

const isTokenValid = ({ token }) => {
  const value = jwt.verify(token, process.env.JWT_SECRET);

  return value;
};

const attachCookieToResponse = ({ res, user }) => {
  const token = createJwt({ payload: user });
  const month = 1000 * 60 * 60 * 24 * 30;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + month),
    signed: true,
  });
};

module.exports = { isTokenValid, createJwt, attachCookieToResponse };
