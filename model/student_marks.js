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

// TIME TEST FUNCTION

/*studentsMarksSchema.pre('save', function (next) {
  const now = new Date();
  const oneMonthLater = new Date(now.setMonth(now.getMonth() + 6));

  this.createdAt = oneMonthLater;
  this.updatedAt = oneMonthLater;
  next();
});*/

studentsMarksSchema.pre('save', function (next) {
  this.studentName = this.studentName.toLowerCase();
  this.subjectTitle = this.subjectTitle.toLowerCase();
  this.examType = this.examType.toLowerCase();
  next();
});

module.exports = monggose.model('StudentMarks', studentsMarksSchema);
