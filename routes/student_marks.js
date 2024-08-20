const {
  createStudentMarks,
  getStudentMarks,
  deleteStudentMark,
  updateStudentMarks,
  getMyMarks,
} = require('../Controllers/student_marks');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');

const Router = express.Router();

Router.get('/AllStudents', authenticaiton, getStudentMarks);
Router.get('/', authenticaiton, getMyMarks);
Router.post('/', authenticaiton, createStudentMarks);
Router.delete('/:id', authenticaiton, deleteStudentMark);
Router.patch('/:id', authenticaiton, updateStudentMarks);

module.exports = Router;
