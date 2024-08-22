const mongoose = require('mongoose');

const homeWork_schema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: 'TEACHER_SCHEMA',
      require: true,
    },

    classHomework: {
      type: String,
      required: true,
    },

    classes: {
      type: String,
      required: true,
    },
    classTypesHomeWork: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },

    deadLine: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeWork', homeWork_schema);
