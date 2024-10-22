const mongoose = require('mongoose');

const notification_schema = new mongoose.Schema(
  {
    notification: {
      type: {
        title: {
          type: String,
          required: [true, 'Please provide notification title'],
        },
        body: {
          type: String,
          required: [true, 'Please provide notification body'],
        },
      },
    },

    tokens: {
      type: [String],
      required: [true, 'please provide tokens'],
    },

    extraData: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notification_schema);
