const { notFoundError } = require('../errors_2');

const not_foundCheck = (res, value, message) => {
  if (!value) {
    return notFoundError(res, message);
  }

  return;
};

module.exports = not_foundCheck;
