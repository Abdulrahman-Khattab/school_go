const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema(
  {
    sunday: {
      type: [String],
      required: [true, 'please provide sunday lectures schedule'],
    },

    monday: {
      type: [String],
      required: [true, 'please provide monday lectures schedule'],
    },

    tuseday: {
      type: [String],
      required: [true, 'please provide tuseday lectures schedule'],
    },

    wednesday: {
      type: [String],
      required: [true, 'please provide wednesday lectures schedule'],
    },

    thursday: {
      type: [String],
      required: [true, 'please provide thursday lectures schedule'],
    },
    friday: {
      type: [String],
      required: [true, 'please provide friday lectures schedule'],
      default: [],
    },

    saturday: {
      type: [String],
      required: [true, 'please provide saturday lectures schedule'],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Weekly_schedule', weeklyScheduleSchema);
