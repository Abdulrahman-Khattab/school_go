const admin = require('firebase-admin');
const Notification = require('../model/notifications');
const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');

const deleteTokenFromUserSchemas = async (token) => {
  // Define schemas to search for the user
  const schemas = [STUDENT_SCHEMA, TEACHER_SCHEMA, CONTROLLER_SCHEMA];

  for (const schema of schemas) {
    // Update the user by removing the token
    const result = await schema.findOneAndUpdate(
      { 'userNotificationTokens.token': token }, // Filter to find the user
      { $pull: { userNotificationTokens: { token } } }, // Pull the token from the array
      { runValidators: true, new: true } // Return the updated document
    );

    if (result) {
      console.log(`Token ${token} deleted from ${schema.modelName}.`);
      return;
    }
  }

  console.log(`Token ${token} not found in any user schemas.`);
};

const sendNotification = async (tokens, payload, failedTokens = []) => {
  try {
    const message = {
      notification: payload.notification,
      tokens: tokens, // Use 'tokens' to send to multiple devices
    };

    // Send the notification using the 'sendEachForMulticast' method for multiple tokens
    const response = await admin.messaging().sendEachForMulticast(message);
    let successTokens = [];

    // Use a for...of loop for async/await
    for (let idx = 0; idx < response.responses.length; idx++) {
      const resp = response.responses[idx];
      const failedToken = tokens[idx];

      if (!resp.success) {
        // Find if the token already exists in failedTokens array
        const tokenIndex = failedTokens.findIndex(
          (item) => item.token === failedToken
        );

        if (tokenIndex > -1) {
          // Increment failure count if token already exists
          failedTokens[tokenIndex].failureCount += 1;

          // If failure count reaches 3, remove token and delete the user
          if (failedTokens[tokenIndex].failureCount >= 3) {
            console.log(`Token ${failedToken} failed 3 times. Deleting...`);
            failedTokens.splice(tokenIndex, 1);

            // Delete the user with this token from any schema
            await deleteTokenFromUserSchemas(failedToken);
          }
        } else {
          // Add new failed token with failureCount 1
          failedTokens.push({ token: failedToken, failureCount: 1 });
        }
      } else {
        successTokens.push(failedToken);
      }
    }

    console.log('Failed tokens:', failedTokens);

    // Continue sending until all failed tokens are handled
    if (failedTokens.length > 0) {
      console.log('Retrying with failed tokens...');
      const retryTokens = failedTokens.map((item) => item.token);
      await sendNotification(retryTokens, payload, failedTokens);
    }

    console.log('Add Notification to database');
    await Notification.create({
      notification: {
        title: payload.notification.title,
        body: payload.notification.body,
      },
      tokens: successTokens,
      extraData: payload.data.extraData,
    });
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
  }
};

const create_notification = async (
  tokens,
  notificationTitle,
  notificationBody,
  extraData = '',
  condition
) => {
  if (condition) {
    const payload = {
      notification: {
        title: notificationTitle,
        body: notificationBody,
      },
      data: {
        extraData: extraData,
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    await sendNotification(tokens, payload);
    return;
  } else return;
};

module.exports = create_notification;
