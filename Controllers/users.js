const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');

//============================
//STUDENTS FUNCTIONS
//============================

const getAllStudents = async (req, res) => {
  res.send('hello all student');
};

const getSingleStudents = async (req, res) => {
  res.send('hello single  student');
};

const deleteStudent = async (req, res) => {
  res.send('hello deleteStudents  student');
};

const updateStudent = async (req, res) => {
  res.send('hello updateStudent  student');
};

const studentVacationRequest = async (req, res) => {
  res.send('hello vacation request student');
};

//============================
//TEACHERS FUNCTIONS
//============================

const getAllTeachers = async (req, res) => {
  res.send('hello all Teacher');
};

const getSingleTeachers = async (req, res) => {
  res.send('hello single  Teacher');
};

const deleteTeacher = async (req, res) => {
  res.send('hello deleteTeachers  Teacher');
};

const updateTeacher = async (req, res) => {
  res.send('hello updateTeacher  Teacher');
};

const teacherVacationRequest = async (req, res) => {
  res.send('hello vacation request Teacher');
};

//============================
//CONTROLERS FUNCTIONS
//============================

const createStudentAccount = async (req, res) => {
  res.send('hello create Account student');
};

const createTeacherAccount = async (req, res) => {
  res.send('hello create Account teacher');
};

const createControllerAccount = async (req, res) => {
  res.send('hello create Account controller');
};

const updateControllerAccount = async (req, res) => {
  res.send('hello update Account controller');
};

const deleteControllerAccount = async (req, res) => {
  res.send('hello delete controllerAccount');
};

const login = async (req, res) => {
  res.send('hello login');
};

module.exports = {
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
};
