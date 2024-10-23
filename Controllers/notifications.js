const Notification = require('../model/notifications');
const create_notification = require('../utility/create_notification');

const { badRequestError, notFoundError } = require('../errors_2');
const check_ID = require('../utility/check_ID');

const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find({});
  if (!notifications) {
    notFoundError(res, 'ThereIsNoNotificationInDatabase');
  }

  res.json({
    data: notifications,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getMyNotifications = async (req, res) => {
  const { username } = req.user;
  const myNotifications = await Notification.find({
    tokens: { $elemMatch: { userUsername: username } },
  }).select('-tokens');

  if (!myNotifications) {
    return notFoundError(res, 'ThereIsNoNotificationsForThisUser');
  }
  res.json({
    data: myNotifications,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteNotifications = async (req, res) => {
  const { id } = req.params;
  check_ID(res, id);
  const deletedNotification = await Notification.findOneAndDelete({ _id: id });
  if (!deletedNotification) {
    return notFoundError(res, 'ThereIsNoNotificationsWithThisId');
  }

  res.json({
    data: deletedNotification,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  getAllNotifications,
  getMyNotifications,
  deleteNotifications,
};
