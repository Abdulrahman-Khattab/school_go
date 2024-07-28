const { StatusCodes } = require('http-status-codes');

const unauthrizedError = (res, message) => {
  return res.status(StatusCodes.FORBIDDEN).json({ msg: message });
};

module.exports = unauthrizedError;
