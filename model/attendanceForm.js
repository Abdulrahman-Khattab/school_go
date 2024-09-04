const mongoose = require('mongoose');

const attendace_Schema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: 'TEACHER_SCHEMA',
      required: true,
    },
    students: {
      type: [
        {
          studentId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'STUDENT_SCHEMA',
          },
          studentName: {
            type: String,
            required: true,
          },
          studentUserName: {
            type: String,
            required: true,
          },
          studentState: {
            type: Number,
            enum: [-1, 0, 1],
            default: 0,
          },
        },
      ],
    },
    className: {
      type: String,
      required: true,
    },
    classType: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    lecture: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attendance_Schema', attendace_Schema);
