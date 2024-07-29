const monggose = require('mongoose');

const userStudentSchema = new monggose.Schema({
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
    default: 'student',
  },

  classNames: {
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
});

module.exports = monggose.model('STUDENT_SCHEMA', userStudentSchema);
