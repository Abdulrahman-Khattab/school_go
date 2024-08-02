const { unauthrizedError } = require('../errors_2');

const checkPermistion = (requestUser, resoruceUserId) => {
  if (requestUser.role === 'admin' || requestUser.role === 'manager') return;
  if (requestUser.userId === String(resoruceUserId)) return;

  return unauthrizedError('notValidUser ');
};

module.exports = checkPermistion;
