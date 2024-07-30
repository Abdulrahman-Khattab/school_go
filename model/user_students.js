const monggose = require('mongoose');
const validator = require('validator');

const userStudentSchema = new monggose.Schema(
  {
    age: {
      type: String,
      required: [true, 'please provide student age'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'please provide student age'],
    },

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
      minLength: 3,
      maxLength: 45,
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

module.exports = monggose.model('STUDENT_SCHEMA', userStudentSchema);
