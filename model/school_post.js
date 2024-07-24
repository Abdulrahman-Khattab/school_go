const monggose = require('mongoose');

const schoolPostSchema = new monggose.Schema({
  image: {
    type: String,
  },

  description: {
    type: String,
    required: [true, 'please provide image'],
  },

  notificaiton: {
    type: Boolean,
    default: false,
  },
});

module.exports = monggose.model('School_post', schoolPostSchema);
