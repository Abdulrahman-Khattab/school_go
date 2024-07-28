const StudentMarks = require('../model/student_marks');
const { badRequestError } = require('../errors_2');

const createStudentMarks = async (req, res) => {
  const { studentName, subjectTitle, examType, studentMark } = req.body;
  if (!studentName) {
    return badRequestError(res, 'please provide student name ');
  }
  if (!subjectTitle) {
    return badRequestError(res, 'please provide subject title ');
  }
  if (!examType) {
    return badRequestError(res, 'please provide exam type ');
  }
  if (!studentMark) {
    return badRequestError(res, 'please provide student Mark ');
  }

  const studentMarkRecord = await StudentMarks.create({ ...req.body });

  res.json({
    studentMarkRecord,
    msg: '',
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
    studentQuery.studentNameMark = studentMark;
  }
  if (subjectTitle) {
    studentQuery.subjectTitle = subjectTitle;
  }
  if (id) {
    studentQuery.id = id;
  }

  const studentsInfo = await StudentMarks.find(studentQuery);

  res.json({ studentsInfo, msg: '' });
};

const deleteStudentMark = async (req, res) => {
  const { name, subject, examType, time } = req.params;
  if (!name) {
    return badRequestError(
      res,
      'please provide name of person that grade wanted to be deleted'
    );
  }
  if (!subject) {
    return badRequestError(
      res,
      'please provide name of subject that grade wanted to be deleted'
    );
  }

  if (!examType) {
    return badRequestError(
      res,
      'please provide exam type of that grade that wanted to be deleted'
    );
  }

  if (!time) {
    return badRequestError(
      res,
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
    return badRequestError(
      res,
      'This Item does not exist in database make sure you provided correct information'
    );
  }

  res.json({
    deletedSutdentGrade,
    msg: '',
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
