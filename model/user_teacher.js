const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userTeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide user name'],
      minLength: 3,
      maxLength: 45,
    },
    username: {
      type: String,
      required: [true, 'please provide user name'],
      minLength: 3,
      maxLength: 45,
      unique: true,
    },

    subject: {
      type: String,
      required: true,
      default: '',
    },

    email: {
      type: String,
      minLength: 3,
      maxLength: 45,
      /*  default: 'This user have no email',
      validate: {
        validator: validator.isEmail,
        message: ' please provide valid email',
      },
      unique: true, */
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
            type: String,
            required: [true, 'please provide class name'],
          },
          classType: {
            type: String,
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
    image: {
      type: String,
      default: '',
    },

    age: {
      type: String,
      default: '',
    },

    phoneNumber: {
      type: String,
      required: [true, 'please provide student phoneNumber'],
    },
    state: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      required: [true, 'please provide Gender'],
      default: 'male',
    },
    userNotificationTokens: {
      type: [
        {
          token: {
            type: String,
            required: true,
          },
          tokenCreatetionDate: {
            type: Date,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

userTeacherSchema.pre('save', async function () {
  // console.log(!this.isModified(this.password));
  //if (!this.isModified(this.password)) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userTeacherSchema.methods.comparePassword = async function (canidate) {
  return await bcrypt.compare(canidate, this.password);
};

userTeacherSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase();
  this.username = this.username.toLowerCase();

  if (this.teacherClasses && this.teacherClasses.length > 0) {
    this.teacherClasses = this.teacherClasses.map((classValue) => {
      return {
        className: classValue.className.toLowerCase(),
        classType: classValue.classType.toLowerCase(),
      };
    });
  }
  next();
});

userTeacherSchema.statics.isUsernameTaken = async function (username) {
  const teacher = this;
  const STUDENT_SCHEMA = require('./user_students');
  const CONTROLLER_SCHEMA = require('./user_controller');

  const user = await teacher.findOne({ username });
  if (user) return true;
  if (await CONTROLLER_SCHEMA.findOne({ username })) return true;
  if (await STUDENT_SCHEMA.findOne({ username })) return true;
  return false;
};

userTeacherSchema.pre('save', async function (next) {
  const teacher = this.constructor;
  if (await teacher.isUsernameTaken(this.username)) {
    const err = new Error('UsernameAlreadyTakenAcrossAllSchemas');
    next(err);
  } else {
    next();
  }
});

module.exports = mongoose.model('TEACHER_SCHEMA', userTeacherSchema);
