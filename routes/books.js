const {
  createBook,
  getMyBooks,
  deleteBook,
  getAllBooks,
  updateBook,
  getBookForTeacher,
} = require('../Controllers/book');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.post('/', authenticaiton, createBook);
Router.get('/getAllBooks', authenticaiton, getAllBooks);
Router.get('/', authenticaiton, getMyBooks);
Router.post('/teacherBooks', authenticaiton, getBookForTeacher);
Router.delete('/:id', authenticaiton, deleteBook);
Router.patch('/:id', authenticaiton, updateBook);

module.exports = Router;
