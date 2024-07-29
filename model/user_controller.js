const monggose = require('mongoose');
const validator = require('validator');
const userControllerSchema = new monggose.Schema(
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
      default: 'controller',
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

module.exports = monggose.model('CONTROLLER_SCHEMA', userControllerSchema);
