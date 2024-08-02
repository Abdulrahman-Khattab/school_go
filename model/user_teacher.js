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
      type: Number,
      required: [true, 'please provide student phoneNumber'],
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

module.exports = mongoose.model('TEACHER_SCHEMA', userTeacherSchema);
