const mongoose = require('mongoose');
const validator = require('validator');

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
    image: {
      type: String,
      default: '',
    },

    phoneNumber: {
      type: Number,
      required: [true, 'please provide student age'],
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

module.exports = mongoose.model('TEACHER_SCHEMA', userTeacherSchema);
