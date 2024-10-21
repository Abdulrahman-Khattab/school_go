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

  const { userNotficationTokens } = user;

  const tokenExist = userNotficationTokens.some(
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
        userNotficationTokens: {
          token: notificationToken,
          tokenCreatetionDate: new Date(), // Add the current date
          failureCount: 0,
        },
      },
    }
  );

  // If the user could be in other schemas (teacher or student), do similar updates
  await TEACHER_SCHEMA.updateOne(
    { username },
    {
      $push: {
        userNotficationTokens: {
          token: notificationToken,
          tokenCreatetionDate: new Date(),
          failureCount: 0,
        },
      },
    }
  );

  await STUDENT_SCHEMA.updateOne(
    { username },
    {
      $push: {
        userNotficationTokens: {
          token: notificationToken,
          tokenCreatetionDate: new Date(),
          failureCount: 0,
        },
      },
    }
  );

  next();
};

module.exports = checkNotificaitonToken;
