const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');

const {
  badRequestError,
  notFoundError,
  unauthenticatedError,
  unauthrizedError,
} = require('../errors_2');

const { attachCookieToResponse } = require('../utility/jwt');
const createUserToken = require('../utility/createTokenUser');

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
  const { name, username, email, password } = req.body;

  if (!name) {
    return badRequestError(res, 'please provide name ');
  }
  if (!username) {
    return badRequestError(res, 'please provide username ');
  }
  if (!password) {
    return badRequestError(res, 'please provide password ');
  }

  const user = await CONTROLLER_SCHEMA.create({
    ...req.body,
  });

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });
  res.json({ data: token, msg: '' });
};

const updateControllerAccount = async (req, res) => {
  res.send(res, 'hello update Account controller');
};

const deleteControllerAccount = async (req, res) => {
  res.send(res, 'hello delete controllerAccount');
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return badRequestError(res, 'Please provide username');
  }

  if (!password) {
    return badRequestError(res, 'please provide password');
  }

  let user = null;

  user = await CONTROLLER_SCHEMA.findOne({ username });
  if (!user) {
    user = await TEACHER_SCHEMA.findOne({ username });
  }

  if (!user) {
    user = await STUDENT_SCHEMA.findOne({ username });
  }

  if (!user) {
    return notFoundError(res, 'This user does not exist');
  }

  const isPasswordcorrect = await user.comparePassword(password);

  if (!isPasswordcorrect) {
    return unauthenticatedError(res, 'please provide correct password ');
  }

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });

  res.json({ data: token, msg: '' });
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
