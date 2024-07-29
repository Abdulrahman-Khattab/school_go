const {
  getAllStudents,
  getSingleStudents,
  deleteStudent,
  updateStudent,
  studentVacationRequest,
  getAllTeachers,
  getSingleTeachers,
  deleteTeacher,
  updateTeacher,
  teacherVacationRequest,
  createStudentAccount,
  createTeacherAccount,
  createControllerAccount,
  updateControllerAccount,
  deleteControllerAccount,
  login,
} = require('../Controllers/users');

const express = require('express');
const Router = express.Router();

//============================
//STUDENTS Routes
//============================
Router.get('/student/:id', getSingleStudents);
Router.get('/student', getAllStudents);
Router.post('/student/vacaitionRequest', studentVacationRequest);
Router.delete('/student/:id', deleteStudent);
Router.patch('/student/:id', updateStudent);

//============================
//TEACHERS Routes
//============================
Router.get('/teacher/:id', getSingleTeachers);
Router.get('/teacher', getAllTeachers);
Router.post('/teacher/vacaitionRequest', teacherVacationRequest);
Router.delete('/teacher/:id', deleteTeacher);
Router.patch('/teacher/:id', updateTeacher);

//============================
//CONTROLLER Routes
//============================

Router.post('/controller', login);
Router.post('/controller/student', createStudentAccount);
Router.post('/controller/teacher', createTeacherAccount);
Router.post('/controller/controller', createControllerAccount);
Router.patch('/controller/:id', updateControllerAccount);
Router.delete('/controller/controller/:id', deleteControllerAccount);

module.exports = Router;
