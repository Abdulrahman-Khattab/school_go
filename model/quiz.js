const mongoose = require('mongoose');

const quiz_schema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: 'TEACHER_SCHEMA',
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    className: {
      type: String,
      required: true,
    },

    classTypes: {
      type: [String],
      required: true,
    },

    quizInformation: {
      type: [
        {
          questionCaption: {
            type: String,
            required: [true, 'PleaseProvideCaption'],
          },
          questions: {
            type: [String],
            required: [true, 'PleaseProvideQuestions'],
          },
          correctAnswer: {
            type: String,
            required: [true, 'PleaseProvideAnswer'],
          },
        },
      ],
    },

    deadLine: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quiz_schema);
