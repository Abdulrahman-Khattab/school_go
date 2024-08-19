const { StatusCodes } = require('http-status-codes');

const badRequestError = (res, message) => {
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: message, data: '', authenticatedUser: '' });
};

module.exports = badRequestError;
