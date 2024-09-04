const { StatusCodes } = require('http-status-codes');

const notFoundError2 = (res, value, message) => {
  if (!value || value.length == 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: message, data: '', authenticatedUser: '' });
  }

  return;
};

module.exports = notFoundError2;
