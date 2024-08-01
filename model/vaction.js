const mongoose = require('mongoose');

const vactionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },
    senderUsername: {
      type: String,
      required: true,
    },

    senderRole: {
      type: String,
      required: true,
    },
    senderDescription: {
      type: String,
      required: true,
    },

    vacationState: {
      type: String,
      enum: ['accepted', 'rejected', ''],
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VACATION_SCHEMA', vactionSchema);
