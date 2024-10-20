const mongoose = require('mongoose');

const emptyLecture = {
  className: '',
  classType: '',
  lectureTime: null,
  lecture: '',
  lectureNumber: 0,
};

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
          lectureNumber: {
            type: Number,
            required: true,
          },
        },
      ],
      required: [true, 'please provide sunday lectures schedule'],
      default: [],
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
          lectureNumber: {
            type: Number,
            required: true,
          },
        },
      ],
      required: [true, 'please provide monday lectures schedule'],
      default: [],
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
          lectureNumber: {
            type: Number,
            required: true,
          },
        },
      ],
      required: [true, 'please provide tuseday lectures schedule'],
      default: [],
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
          lectureNumber: {
            type: Number,
            required: true,
          },
        },
      ],
      required: [true, 'please provide wednesday lectures schedule'],
      default: [],
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
          lectureNumber: {
            type: Number,
            required: true,
          },
        },
      ],
      required: [true, 'please provide thursday lectures schedule'],
      default: [],
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
          lectureNumber: {
            type: Number,
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
          lectureNumber: {
            type: Number,
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

const fillEmptyLectures = (lectures) => {
  const maxLectures = 8;

  // Check if lectures is an array, if not, return an empty filled array
  if (!Array.isArray(lectures)) {
    return Array(maxLectures).fill(emptyLecture);
  }

  const filledLectures = [...lectures]; // Start with provided lectures
  while (filledLectures.length < maxLectures) {
    filledLectures.push(emptyLecture); // Add empty lecture until the max is reached
  }

  return filledLectures; // Return the filled array
};

teacher_weekly_schedules_schema.pre('save', function (next) {
  this.sunday = fillEmptyLectures(this.sunday);
  this.monday = fillEmptyLectures(this.monday);
  this.tuesday = fillEmptyLectures(this.tuesday);
  this.wednesday = fillEmptyLectures(this.wednesday);
  this.thursday = fillEmptyLectures(this.thursday);
  this.friday = fillEmptyLectures(this.friday);
  this.saturday = fillEmptyLectures(this.saturday);
  next(); // Proceed to save the document
});

module.exports = mongoose.model(
  'Teacher_schedule',
  teacher_weekly_schedules_schema
);
