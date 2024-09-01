const monggose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { badRequestError } = require('../errors_2');

const userStudentSchema = new monggose.Schema(
  {
    age: {
      type: String,
      required: [true, 'please provide student age'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'please provide student phoneNumber'],
    },

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

    gender: {
      type: String,
      required: [true, 'please provide Gender'],
    },

    email: {
      type: String,

      default: '',
      /* validate: {
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
      default: 'student',
    },

    className: {
      type: String,
      required: [true, 'please provide student class Name'],
    },

    classType: {
      type: String,
      required: [true, 'please provide student class type'],
    },

    student_parents: {
      type: [String],
      required: [true, 'please provide student gurdian'],
      validate: {
        validator: function (v) {
          v.length > 0;
        },
        message: 'Please at least add 1 gurdian',
      },
    },
    image: {
      type: String,
      default: '',
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userStudentSchema.pre('save', async function () {
  // console.log(!this.isModified(this.password));
  //if (!this.isModified(this.password)) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userStudentSchema.methods.comparePassword = async function (canidate) {
  return await bcrypt.compare(canidate, this.password);
};

userStudentSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase();
  this.username = this.username.toLowerCase();
  if (this.student_parents && this.student_parents.length > 0) {
    this.student_parents = this.student_parents.map((parent) =>
      parent.toLowerCase()
    );
  }

  next();
});

userStudentSchema.statics.isUsernameTaken = async function (username) {
  const Student = this;
  const TEACHER_SCHEMA = require('./user_teacher');
  const CONTROLLER_SCHEMA = require('./user_controller');

  const user = await Student.findOne({ username });
  if (user) return true;
  if (await TEACHER_SCHEMA.findOne({ username })) return true;
  if (await CONTROLLER_SCHEMA.findOne({ username })) return true;
  return false;
};

userStudentSchema.pre('save', async function (next) {
  const student = this.constructor;
  if (await student.isUsernameTaken(this.username)) {
    const err = new Error('UsernameAlreadyTakenAcrossAllSchemas');
    next(err);
  } else {
    next();
  }
});

module.exports = monggose.model('STUDENT_SCHEMA', userStudentSchema);
