const { StatusCodes } = require('http-status-codes');

const unauthrizedError = (res, message) => {
  return res
    .status(StatusCodes.FORBIDDEN)
    .json({ msg: message, data: '', authenticatedUser: '' });
};

module.exports = unauthrizedError;
