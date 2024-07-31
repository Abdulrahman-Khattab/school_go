//const { isTokenValid } = require('../utility/jwt');
const { unauthenticatedError, unauthrizedError } = require('../errors_2');

const authenticaiton = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    token = req.signedCookies.token;
  }
  //console.log(token);
  //console.log('we are here');

  if (!token) {
    return unauthenticatedError(res, 'authentication Invalid');
  }

  const { username, userId, role } = token;

  const user = { username, userId, role };

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
