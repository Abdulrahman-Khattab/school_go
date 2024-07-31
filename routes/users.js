const {
  getSingleStudents,
  deleteStudent,
  updateStudent,
  studentVacationRequest,
  getSingleTeachers,
  deleteTeacher,
  updateTeacher,
  teacherVacationRequest,
  createStudentAccount,
  createTeacherAccount,
  createControllerAccount,
  updateAccount,
  deleteAccount,
  login,
  getAllUsers,
} = require('../Controllers/users');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');
const Router = express.Router();

//============================
//STUDENTS Routes
//============================
Router.get('/student/:id', authenticaiton, getSingleStudents);
Router.post(
  '/student/vacaitionRequest',
  authenticaiton,
  studentVacationRequest
);
Router.delete('/student/:id', authenticaiton, deleteStudent);
Router.patch('/student/:id', authenticaiton, updateStudent);

//============================
//TEACHERS Routes
//============================
Router.get('/teacher/:id', authenticaiton, getSingleTeachers);
Router.post(
  '/teacher/vacaitionRequest',
  authenticaiton,
  teacherVacationRequest
);
Router.delete('/teacher/:id', authenticaiton, deleteTeacher);
Router.patch('/teacher/:id', authenticaiton, updateTeacher);

//============================
//CONTROLLER Routes
//============================

Router.post('/controller', login);
Router.post('/controller/student', authenticaiton, createStudentAccount);
Router.post('/controller/teacher', authenticaiton, createTeacherAccount);
Router.post('/controller/controller', authenticaiton, createControllerAccount);
Router.patch('/controller/:id', authenticaiton, updateAccount);
Router.delete('/controller/controller/:id', authenticaiton, deleteAccount);
Router.get('/controller/users', authenticaiton, getAllUsers);

module.exports = Router;
