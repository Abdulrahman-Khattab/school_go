const mongoose = require('mongoose');

const teacher_weekly_schedules_schema = new mongoose.Schema(
  {
    teacherUsername: {
      type: String,
      required: [true, 'please provide teacher username'],
    },

    sunday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide sunday lectures schedule'],
    },

    monday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide monday lectures schedule'],
    },

    tuseday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide tuseday lectures schedule'],
    },

    wednesday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide wednesday lectures schedule'],
    },

    thursday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide thursday lectures schedule'],
    },
    friday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide friday lectures schedule'],
      default: [],
    },

    saturday: {
      type: [
        {
          className: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            required: true,
          },
          lectureTime: {
            type: Date,
            required: true,
          },
          lecture: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, 'please provide saturday lectures schedule'],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'Teacher_schedule',
  teacher_weekly_schedules_schema
);
