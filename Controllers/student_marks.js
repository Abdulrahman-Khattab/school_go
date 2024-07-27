const StudentMarks = require('../model/student_marks');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createStudentMarks = async (req, res) => {
  const { studentName, subjectTitle, examType, studentMark } = req.body;
  if (!studentName) {
    throw new BadRequestError('please provide student name ');
  }
  if (!subjectTitle) {
    throw new BadRequestError('please provide subject title ');
  }
  if (!examType) {
    throw new BadRequestError('please provide exam type ');
  }
  if (!studentMark) {
    throw new BadRequestError('please provide student Mark ');
  }

  const studentMarkRecord = await StudentMarks.create({ ...req.body });

  res.json({
    studentMarkRecord,
    msg: 'Student mark record created sucessfully',
  });
};

const getStudentMarks = async (req, res) => {
  const { studentName, examType, studentMark, subjectTitle } = req.query;

  const studentQuery = {};

  if (studentName) {
    studentQuery.studentName = studentName;
  }
  if (examType) {
    studentQuery.examType = examType;
  }

  if (studentMark) {
    studentQuery.studentNameMark = studentMark;
  }
  if (subjectTitle) {
    studentQuery.subjectTitle = subjectTitle;
  }

  const studentsInfo = await StudentMarks.find(studentQuery);

  res.json({ studentsInfo, msg: 'information retrievd sucessfully' });
};

const deleteStudentMark = async (req, res) => {
  const { name, subject, examType, time } = req.params;
  if (!name) {
    throw new BadRequestError(
      'please provide name of person that grade wanted to be deleted'
    );
  }
  if (!subject) {
    throw new BadRequestError(
      'please provide name of subject that grade wanted to be deleted'
    );
  }

  if (!examType) {
    throw new BadRequestError(
      'please provide exam type of that grade that wanted to be deleted'
    );
  }

  if (!time) {
    throw new BadRequestError(
      'please provide time of that grade that wanted to be deleted'
    );
  }

  const deletedSutdentGrade = await StudentMarks.findOneAndDelete({
    studentName: name,
    examType: examType,
    subjectTitle: subject,
    createdAt: new Date(time),
  });

  if (!deletedSutdentGrade) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: 'This Item does not exist in database make sure you provided correct information',
    });
  }

  res.json({
    deletedSutdentGrade,
    msg: 'information of student grade deleted sucessfully',
  });
};

const updateStudentMarks = async (req, res) => {
  res.send('hello update student mark ');
};

module.exports = {
  createStudentMarks,
  getStudentMarks,
  deleteStudentMark,
  updateStudentMarks,
};
