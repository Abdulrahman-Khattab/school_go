const mongoose = require('mongoose');
const { badRequestError } = require('../errors_2');

const check_ID = (res, id) => {
  if (!id) {
    return badRequestError(res, 'pleaseProvideID');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideCorrectID');
  }

  return;
};

module.exports = check_ID;
