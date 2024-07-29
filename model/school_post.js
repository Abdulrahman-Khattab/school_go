const monggose = require('mongoose');

const schoolPostSchema = new monggose.Schema(
  {
    image: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      required: [true, 'please provide image'],
    },

    notificaiton: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = monggose.model('School_post', schoolPostSchema);
