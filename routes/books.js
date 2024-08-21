const {
  createBook,
  getMyBooks,
  deleteBook,
  getAllBooks,
} = require('../Controllers/book');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.post('/', authenticaiton, createBook);
Router.get('/getAllBooks', authenticaiton, getAllBooks);
Router.get('/', authenticaiton, getMyBooks);
Router.delete('/:id', authenticaiton, deleteBook);

module.exports = Router;
