const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');

const {
  badRequestError,
  notFoundError,
  unauthenticatedError,
  unauthrizedError,
} = require('../errors_2');

const checkNotificaitonToken = async (req, res, next) => {
  const notificationToken = req.user.notificationToken;
  const username = req.user.username;

  if (!notificationToken) {
    return next();
  }

  let user;

  user = await CONTROLLER_SCHEMA.findOne({ username });

  if (!user) {
    user = await TEACHER_SCHEMA.findOne({ username });
  }

  if (!user) {
    user = await STUDENT_SCHEMA.findOne({ username });
    console.log(user);
  }

  if (!user) {
    return notFoundError(res, 'thisUserDoesNotExist');
  }

  const { userNotificationTokens } = user;

  const tokenExist = userNotificationTokens.some(
    (notification) => notification.token === notificationToken
  );

  if (tokenExist) {
    return next();
  }

  // Update the user's notification tokens directly in the database
  await CONTROLLER_SCHEMA.updateOne(
    { username }, // Filter: find the user by username
    {
      $push: {
        userNotificationTokens: {
          token: notificationToken,
          tokenCreatetionDate: new Date(), // Add the current date
        },
      },
    }
  );

  // If the user could be in other schemas (teacher or student), do similar updates
  await TEACHER_SCHEMA.updateOne(
    { username },
    {
      $push: {
        userNotificationTokens: {
          token: notificationToken,
          tokenCreatetionDate: new Date(),
        },
      },
    }
  );

  await STUDENT_SCHEMA.updateOne(
    { username },
    {
      $push: {
        userNotificationTokens: {
          token: notificationToken,
          tokenCreatetionDate: new Date(),
        },
      },
    }
  );

  next();
};

module.exports = checkNotificaitonToken;
