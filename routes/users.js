const {
  vacationRequest,
  createStudentAccount,
  createTeacherAccount,
  createControllerAccount,
  updateAccount,
  deleteAccount,
  login,
  getAllUsers,
  getWeeklyVacationRequest,
  checkUserInfo,
  myVacations,
  updateVacationState,
  getMyTeachers,
  getMyStudentsGrade,
  testTokenFunction,
} = require('../Controllers/users');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');
const checkNotificaitonToken = require('../middleware/checkNotificationToken');
const Router = express.Router();

//============================
//GENERAL ROUTES
//============================

Router.post('/vacaitionRequest', authenticaiton, vacationRequest);
Router.post('/login', login);
Router.get(
  '/checkUserInfo',
  authenticaiton,
  checkNotificaitonToken,
  checkUserInfo
);

//============================
//CONTROLLER Routes
//============================

Router.post('/controller/student', authenticaiton, createStudentAccount);
Router.post('/controller/teacher', authenticaiton, createTeacherAccount);
Router.post('/controller/controller', authenticaiton, createControllerAccount);
Router.patch('/controller/:id', authenticaiton, updateAccount);
Router.delete('/controller/controller/:id', authenticaiton, deleteAccount);
Router.get('/controller/users', authenticaiton, getAllUsers);
Router.get('/controller/vacations', authenticaiton, getWeeklyVacationRequest);
Router.get('/vacations/myVacations', authenticaiton, myVacations);
Router.patch(
  '/vacations/updateVacationState/:id',
  authenticaiton,
  updateVacationState
);

//============================
//TEACHER Routes
//============================

Router.get('/teachers/myStudentGrade', authenticaiton, getMyStudentsGrade);

//============================
//STUDENT Routes
//============================
Router.get('/student/myTeachers', authenticaiton, getMyTeachers);

//TEST
Router.get('/test', authenticaiton, testTokenFunction);

module.exports = Router;
