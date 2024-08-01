const monggose = require('mongoose');
const bcrypt = require('bcrypt');
const userControllerSchema = new monggose.Schema(
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
      default: '',
      /* validate: {
        validator: validator.isEmail,
        message: ' please provide valid email',
      }, */
      // unique: true,
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
    phoneNumber: {
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

userControllerSchema.pre('save', async function () {
  // console.log(!this.isModified(this.password));
  //if (!this.isModified(this.password)) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userControllerSchema.methods.comparePassword = async function (canidate) {
  return await bcrypt.compare(canidate, this.password);
};

module.exports = monggose.model('CONTROLLER_SCHEMA', userControllerSchema);
