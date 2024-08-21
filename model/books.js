const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    bookPDF: {
      type: String,
      required: [true, 'please provide book'],
    },

    bookCover: {
      type: String,
      required: [true, 'please provide book cover'],
    },

    title: {
      type: String,
      required: [true, 'please provide book title'],
    },
    caption: {
      type: String,
      default: '',
    },

    bookClass: {
      type: String,
      required: [true, 'please provide book class'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Books', bookSchema);
