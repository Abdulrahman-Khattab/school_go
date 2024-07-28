const badRequestError = require('./Bad_request');
const notFoundError = require('./NotFound');
const unauthenticatedError = require('./unauthenticatedError');
const unauthrizedError = require('./unauthrizedError');

module.exports = {
  badRequestError,
  notFoundError,
  unauthenticatedError,
  unauthrizedError,
};
