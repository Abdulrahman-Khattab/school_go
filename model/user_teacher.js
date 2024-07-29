const mongoose = require('mongoose');

const userTeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide user name'],
      minLength: 3,
      maxLength: 45,
    },
    userName: {
      type: String,
      required: [true, 'please provide user name'],
      minLength: 3,
      maxLength: 45,
      unique: true,
    },

    email: {
      type: String,
      required: [true, 'please provide user email'],
      minLength: 3,
      maxLength: 45,
      default: 'This user have no email',
      validate: {
        validator: validator.isEmail,
        message: ' please provide valid email',
      },
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'please provide password'],
      mingLength: 6,
      maxLength: 50,
    },

    role: {
      type: String,
      default: 'teacher',
    },

    teacherClasses: {
      type: [
        {
          className: {
            type: 'String',
            required: [true, 'please provide class name'],
          },
          classType: {
            type: 'String',
            required: [true, 'please provide class type'],
          },
        },
      ],
      required: [true, 'please provide teacher classes'],
      validate: {
        validator: function (v) {
          v.length > 0;
        },
        message: 'Teacher should be assigned at least for 1 class',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TEACHER_SCHEMA', userTeacherSchema);
