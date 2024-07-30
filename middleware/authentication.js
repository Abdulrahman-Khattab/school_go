const { isTokenValid } = require('../utility/jwt');
const { unauthenticatedError, unauthrizedError } = require('../errors_2');

const authenticaiton = (req, res, next) => {
  const token = req.signedCookies.token;
  const tokenCookie = req.headers.cookie;

  console.log(token);
  console.log('DIFFRENECE HERE ');
  console.log(tokenCookie);

  if (!tokenCookie) {
    return unauthenticatedError(res, 'authentication Invalid');
  }

  const payload = isTokenValid({ tokenCookie });
  if (!payload) {
    return unauthenticatedError(res, 'authentication Invalid');
  }

  const { name, userId, role } = payload;

  const user = { name, userId, role };

  req.user = user;

  next();
};

const authrizePermistion = (...roles) => {
  // console.log(roles);

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return unauthrizedError(res, 'authriezation denied');
    }

    next();
  };
};

module.exports = { authenticaiton, authrizePermistion };
