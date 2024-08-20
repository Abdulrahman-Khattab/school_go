const mongoose = require('mongoose');

const monthly_calender_schema = new mongoose.Schema(
  {
    schoolNote: {
      type: Boolean,
      default: false,
    },

    classesNote: {
      type: [
        {
          className: {
            type: String,
          },
          classTypes: {
            type: [String],
          },
        },
      ],
      default: [],
    },

    studentNote: {
      type: [String],

      default: [],
    },

    teacherNote: {
      type: [String],
      default: [],
    },

    note: {
      type: String,
      required: [true, 'please provide a note '],
    },

    noteTime: {
      type: Date,
      required: [true, 'please provide a date '],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Monthly_calender', monthly_calender_schema);
