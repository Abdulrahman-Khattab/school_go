const StudentMarks = require('../model/student_marks');
const { badRequestError, notFoundError } = require('../errors_2');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const STUDENT_SCHEMA = require('../model/user_students');

const createStudentMarks = async (req, res) => {
  const { studentName, subjectTitle, examType, studentMark, username } =
    req.body;
  if (!studentName) {
    return badRequestError(res, 'pleaseProvideStudentName');
  }
  if (!subjectTitle) {
    return badRequestError(res, 'pleaseProvideSubjectTitle');
  }
  if (!examType) {
    return badRequestError(res, 'pleaseProvideExamType');
  }
  if (!studentMark) {
    return badRequestError(res, 'pleaseProvideStudentMark');
  }
  if (!username) {
    return badRequestError(res, 'pleaseProvideusername');
  }

  const studentMarkRecord = await StudentMarks.create({ ...req.body });

  res.json({
    data: studentMarkRecord,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getStudentMarks = async (req, res) => {
  const { studentName, examType, studentMark, subjectTitle, id } = req.query;

  const studentQuery = {};

  if (studentName) {
    studentQuery.studentName = studentName;
  }
  if (examType) {
    studentQuery.examType = examType;
  }

  if (studentMark) {
    studentQuery.studentMark = studentMark;
  }
  if (subjectTitle) {
    studentQuery.subjectTitle = subjectTitle;
  }
  if (id) {
    studentQuery.id = id;
  }

  const studentsInfo = await StudentMarks.find(studentQuery);

  res.json({ data: studentsInfo, msg: '', authenticatedUser: res.locals.user });
};

const getMyMarks = async (req, res) => {
  req.body.userId = req.user.userId;
  const { userId } = req.body;
  const { studentName, examType, studentMark, subjectTitle, id } = req.query;

  const studentQuery = {};

  if (studentName) {
    studentQuery.studentName = studentName;
  }
  if (examType) {
    studentQuery.examType = examType;
  }

  if (studentMark) {
    studentQuery.studentMark = studentMark;
  }
  if (subjectTitle) {
    studentQuery.subjectTitle = subjectTitle;
  }
  if (id) {
    studentQuery.id = id;
  }

  if (!userId) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: userId });

  if (!studentInfo) {
    return notFoundError(res, 'ThereNoSuchStudentInDatabase');
  }

  const studentMarks = await StudentMarks.find({
    username: studentInfo.username,
    ...studentQuery,
  });

  if (!studentMarks) {
    return notFoundError(res, 'ThisStudentHaveNoExamInformation');
  }

  res.json({ data: studentMarks, msg: '', authenticatedUser: res.locals.user });
};

const deleteStudentMark = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'pleaseProvideStudentMarkID ');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFoundError(res, 'pleaseReturnValidIDFormat');
  }

  const deletedSutdentGrade = await StudentMarks.findOneAndDelete({
    _id: id,
  });

  if (!deletedSutdentGrade) {
    return badRequestError(
      res,
      'thisItemDoesNotExistInDatabaseMakeSureYouProvidedCorrectInformation'
    );
  }

  res.json({
    data: deletedSutdentGrade,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateStudentMarks = async (req, res) => {
  const { id } = req.params;
  const { studentName, subjectTitle, examType, studentMark } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFoundError(res, 'pleaseReturnValidIDFormat');
  }
  const studentUpdateObject = {};

  if (studentName) {
    studentUpdateObject.studentName = studentName;
  }
  if (examType) {
    studentUpdateObject.examType = examType;
  }

  if (studentMark) {
    studentUpdateObject.studentMark = studentMark;
  }
  if (subjectTitle) {
    studentUpdateObject.subjectTitle = subjectTitle;
  }

  const updatedStudentGradeInformation = await StudentMarks.findOneAndUpdate(
    { _id: id },
    studentUpdateObject,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedStudentGradeInformation) {
    return badRequestError(res, 'somethingWrongHappendedPleaseTryAgain');
  }

  res.status(StatusCodes.OK).json({
    data: updatedStudentGradeInformation,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createStudentMarks,
  getStudentMarks,
  deleteStudentMark,
  updateStudentMarks,
  getMyMarks,
};
