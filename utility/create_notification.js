const admin = require('firebase-admin');
const Notification = require('../model/notifications');

const sendNotification = async (tokens, payload) => {
  try {
    const message = {
      notification: payload.notification,
      tokens: tokens, // Use 'tokens' to send to multiple devices
    };

    // Send the notification using the 'sendMulticast' method for multiple tokens
    const response = await admin.messaging().sendEachForMulticast(message);
    let sucessTokens = [];
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.log('Notification error:', resp.error);
        } else {
          sucessTokens.push(tokens[idx]);
        }
      });
      console.log('Failed tokens:', failedTokens);
    }

    if (sucessTokens.length < 1) {
      sucessTokens = tokens;
    }

    console.log('Add Notification to data base');
    await Notification.create({
      notification: {
        title: payload.notification.title,
        body: payload.notification.body,
      },
      tokens: sucessTokens,
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
