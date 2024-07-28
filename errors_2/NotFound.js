const { StatusCodes } = require('http-status-codes');

const notFoundError = (res, message) => {
  return res.status(StatusCodes.NOT_FOUND).json({ msg: message });
};

module.exports = notFoundError;