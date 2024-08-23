const mongoose = require('mongoose');

const resource_schema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: 'TEACHER_SCHEMA',
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

    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resource_schema);
