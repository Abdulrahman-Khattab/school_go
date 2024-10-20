const StudentMarks = require('../model/student_marks');
const { badRequestError, notFoundError } = require('../errors_2');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const STUDENT_SCHEMA = require('../model/user_students');
const create_notification = require('../utility/create_notification');

const createStudentMarks = async (req, res) => {
  const { students, subjectTitle, examType } = req.body;
  if (students.length < 1) {
    return badRequestError(res, 'pleaseProvideStudentName');
  }
  if (!subjectTitle) {
    return badRequestError(res, 'pleaseProvideSubjectTitle');
  }
  if (!examType) {
    return badRequestError(res, 'pleaseProvideExamType');
  }

  const studentMarkRecord = await StudentMarks.create({ ...req.body });

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'Create marks',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

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
    studentQuery['students.studentName'] = studentName;
  }
  if (examType) {
    studentQuery.examType = examType;
  }

  if (studentMark) {
    studentQuery['students.studentMark'] = studentMark;
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
    ['students.username']: studentInfo.username,
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

  const { username } = req.body;
  console.log(username);

  const deletedSutdentGrade = await StudentMarks.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        students: { username },
      },
    },
    { new: true }
  );

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
  const { subjectTitle, examType, studentsToUpdate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFoundError(res, 'pleaseReturnValidIDFormat');
  }
  const studentUpdateObject = {};

  if (examType) {
    studentUpdateObject.examType = examType;
  }

  if (subjectTitle) {
    studentUpdateObject.subjectTitle = subjectTitle;
  }

  if (studentsToUpdate.length > 0 && studentsToUpdate) {
    for (const student of studentsToUpdate) {
      const { username, newUsername, studentMark } = student;
      const studentUpdateInfo = {};
      if (newUsername) {
        studentUpdateInfo['students.$.username'] = newUsername;
      }
      if (studentMark) {
        studentUpdateInfo['students.$.studentMark'] = studentMark;
      }
      console.log(studentUpdateInfo);

      await StudentMarks.findOneAndUpdate(
        {
          _id: id,
          'students.username': username,
        },
        {
          $set: studentUpdateInfo,
        },
        { runValidators: true, new: true }
      );
    }
  }

  const updatedStudentsExamInformation = await StudentMarks.findOneAndUpdate(
    { _id: id },
    { $set: studentUpdateObject },
    {
      runValidators: true,
      new: true,
    }
  );

  const updatedStudentGradeInformation = await StudentMarks.findById(id);

  if (!updatedStudentGradeInformation) {
    return badRequestError(res, 'somethingWrongHappendedPleaseTryAgain');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'Update marks ',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.status(StatusCodes.OK).json({
    data: updatedStudentGradeInformation,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteStudnetsExam = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'pleaseProvideStudentMarkID ');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFoundError(res, 'pleaseReturnValidIDFormat');
  }

  const deletedExamRecord = await StudentMarks.findOneAndDelete({
    _id: id,
  });
  if (!deletedExamRecord) {
    return badRequestError(
      res,
      'DeletedExamRecordHasNotGoneAsExpectedTryAgainLater'
    );
  }

  res.status(StatusCodes.OK).json({
    data: deletedExamRecord,
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
  deleteStudnetsExam,
};
