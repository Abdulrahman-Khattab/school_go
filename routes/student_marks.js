const {
  createStudentMarks,
  getStudentMarks,
  deleteStudentMark,
  updateStudentMarks,
} = require('../Controllers/student_marks');

const express = require('express');

const Router = express.Router();

Router.get('/', getStudentMarks);
Router.post('/', createStudentMarks);
Router.delete('/:id', deleteStudentMark);
Router.patch('/:id', updateStudentMarks);

module.exports = Router;
