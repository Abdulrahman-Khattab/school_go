const {
  createStudentMarks,
  getStudentMarks,
  deleteStudentMark,
  updateStudentMarks,
} = require('../Controllers/student_marks');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');

const Router = express.Router();

Router.get('/', authenticaiton, getStudentMarks);
Router.post('/', authenticaiton, createStudentMarks);
Router.delete('/:id', authenticaiton, deleteStudentMark);
Router.patch('/:id', authenticaiton, updateStudentMarks);

module.exports = Router;
