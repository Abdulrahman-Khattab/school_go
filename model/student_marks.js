const monggose = require('mongoose');

const studentsMarksSchema = new monggose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'student name must be included'],
    },

    subjectTitle: {
      type: String,
      required: [true, 'Subject title must be included '],
    },
    examType: {
      type: String,
      required: [true, 'exam type must be included'],
      enum: ['quiz', 'mid-term', 'end-term', 'monthly'],
    },

    studentMark: {
      type: Number,
      required: [true, 'exam mark must be included'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = monggose.model('StudentMarks', studentsMarksSchema);
