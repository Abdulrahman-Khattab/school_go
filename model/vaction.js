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
      type: Number,
      enum: [-1, 0, 1],
      default: 0,
    },

    vacationStartTime: {
      type: Date,
      default: '',
    },

    vacationEndTime: {
      type: Date,
      default: '',
    },
  },
  { timestamps: true }
);

vactionSchema.pre('save', function (next) {
  this.senderName = this.senderName.toLowerCase();
  this.senderUsername = this.senderUsername.toLowerCase();
  this.senderRole = this.senderRole.toLowerCase();
  this.senderDescription = this.senderDescription.toLowerCase();

  next();
});

module.exports = mongoose.model('VACATION_SCHEMA', vactionSchema);
