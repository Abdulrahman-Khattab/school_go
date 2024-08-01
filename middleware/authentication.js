//const { isTokenValid } = require('../utility/jwt');
const {
  unauthenticatedError,
  unauthrizedError,
  notFoundError,
} = require('../errors_2');
const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');

const authenticaiton = async (req, res, next) => {
  let token = req.headers.token;
  token = JSON.parse(token);
  if (!token) {
    token = req.signedCookies.token;
  }
  console.log(token);
  console.log('we are here');

  if (!token) {
    return unauthenticatedError(res, 'authentication Invalid');
  }

  const { username, userId, role } = token;

  console.log(userId);

  let validUser = await STUDENT_SCHEMA.findOne({ _id: userId });
  if (!validUser) {
    validUser = await TEACHER_SCHEMA.findOne({ _id: userId });
  }

  if (!validUser) {
    validUser = await CONTROLLER_SCHEMA.findOne({ _id: userId });
  }

  if (!validUser) {
    return notFoundError(res, 'This user does not exist ');
  }

  let state = false;

  state = validUser._id != userId || validUser.username != username;

  // Add the state property to validUser

  validUser.state = state;
  res.locals.user = validUser;

  //console.log(validUser);

  const user = { username, userId, role, name: validUser.name };

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
