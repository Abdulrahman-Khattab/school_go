const mongoose = require('mongoose');
const { badRequestError } = require('../errors_2');

const bad_requestCheck = (res, value, message) => {
  if (!value) {
    return badRequestError(res, message);
  }

  return;
};

module.exports = bad_requestCheck;
