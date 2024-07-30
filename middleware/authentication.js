const { isTokenValid } = require('../utility/jwt');
const { unauthenticatedError, unauthrizedError } = require('../errors_2');

const authenticaiton = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    return unauthenticatedError('authentication Invalid');
  }

  const payload = isTokenValid({ token });
  if (!payload) {
    return unauthenticatedError('authentication Invalid');
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
      return unauthrizedError('authriezation denied');
    }

    next();
  };
};

module.exports = { authenticaiton, authrizePermistion };
