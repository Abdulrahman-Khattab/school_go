const { isTokenValid } = require('../utils');
const { UnauthenticatedError, UnauthorizedError } = require('../errors');

const authenticaiton = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError('authentication Invalid');
  }

  const payload = isTokenValid({ token });
  if (!payload) {
    throw new UnauthenticatedError('authentication Invalid');
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
      throw new UnauthorizedError('authriezation denied');
    }

    next();
  };
};

module.exports = { authenticaiton, authrizePermistion };
