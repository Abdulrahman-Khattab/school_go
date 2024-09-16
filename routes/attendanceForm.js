const {
  createAttendanceForm,
  getStudentsForTeacher,
  getTeacherSubjectAttendance,
  getAllStudentsOfSpeceficClass,
  deleteAttendnceForm,
  updateAttendnceForm,
} = require('../Controllers/attendanceForm');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.post('/', authenticaiton, createAttendanceForm);
Router.post('/getStudentsForTeacher', authenticaiton, getStudentsForTeacher);
Router.get(
  '/getTeacherSubjectAttendance',
  authenticaiton,
  getTeacherSubjectAttendance
);
Router.post(
  '/getAllStudentsOfSpeceficClass',
  authenticaiton,
  getAllStudentsOfSpeceficClass
);
Router.delete('/:id', authenticaiton, deleteAttendnceForm);
Router.patch('/:id', authenticaiton, updateAttendnceForm);

module.exports = Router;
