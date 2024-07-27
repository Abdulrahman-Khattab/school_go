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
Router.delete('/:name/:subject/:examType/:time', deleteStudentMark);
Router.patch('/:name/:subject/:examType/:time', updateStudentMarks);

module.exports = Router;
