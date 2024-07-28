const { StatusCodes } = require('http-status-codes');

const unauthenticatedError = (res, message) => {
  return res.status(StatusCodes.UNAUTHORIZED).json({ msg: message });
};

module.exports = unauthenticatedError;
