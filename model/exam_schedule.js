const mongoose = require('mongoose');

const exam_schedule_schema = new mongoose.Schema(
  {
    examDate: {
      type: Date,
      required: [true, 'pleaseProvideExamDate'],
    },

    examLecture: {
      type: String,
      required: [true, 'PleaseProvideExamLecture'],
    },

    subjectName: {
      type: String,
      required: [true, 'pleaseProvideSubjectName'],
    },

    examClassName: {
      type: String,
      required: [true, 'PleaseProvideExamClass'],
    },

    examClassType: {
      type: String,
      required: [true, 'PleaseProvideClassType'],
    },

    examType: {
      type: String,
      enum: ['quiz', 'mid-term', 'end-term', 'monthly'],
      required: [true, 'pleaseProvudeExamType'],
    },
    note: {
      type: String,
      maxlength: 150,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exam_schedule', exam_schedule_schema);
