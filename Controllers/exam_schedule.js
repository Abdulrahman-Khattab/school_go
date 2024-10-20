const Exam_schedule = require('../model/exam_schedule');
const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const mongoose = require('mongoose');
const {
  badRequestError,
  notFoundError,
  notFoundError2,
} = require('../errors_2');
const check_ID = require('../utility/check_ID');
const create_notification = require('../utility/create_notification');

const getALLExamsScheduled = async (req, res) => {
  const allExams = await Exam_schedule.find({});
  if (!allExams) {
    return badRequestError(res, 'NoExamsFoundINDB');
  }

  res.json({ data: allExams, msg: '', authenticatedUser: res.locals.user });
};

const getMyExams = async (req, res) => {
  req.body.userId = req.user.userId;

  const { userId } = req.body;

  if (!userId) {
    return badRequestError(res, 'PleaseProvideuserId');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return badRequestError(res, 'PleaseProvideValiduserId');
  }

  const userInfo = await STUDENT_SCHEMA.findOne({ _id: userId });

  if (!userInfo) {
    return notFoundError(res, 'ThereNoSuchStudentInDataBase');
  }

  const examQuery = {};
  if (!userInfo.className) {
    return badRequestError(res, 'PleaseProvideExamClassName');
  }

  if (!userInfo.classType) {
    return badRequestError(res, 'PleaseProvideExamClassType');
  }

  examQuery.examClassName = userInfo.className;
  examQuery.examClassType = userInfo.classType;

  const myExams = await Exam_schedule.find(examQuery);

  if (!myExams) {
    return res.json({
      data: '',
      msg: 'NoDataToShow',
      authenticatedUser: res.locals.user,
    });
  }

  res.json({ data: myExams, msg: '', authenticatedUser: res.locals.user });
};

const createExamInfo = async (req, res) => {
  const {
    examDate,
    examLecture,
    subjectName,
    examClassName,
    examClassType,
    examType,
  } = req.body;

  const teacherId = req.user.userId;

  if (!examDate) {
    return badRequestError(res, 'PleaseProvideExamDate');
  }

  if (!examLecture) {
    return badRequestError(res, 'PleaseProvideExamLecture');
  }

  if (!subjectName) {
    return badRequestError(res, 'PleaseProvideSubjectName');
  }

  if (!examClassName) {
    return badRequestError(res, 'PleaseProvideExamClassName');
  }
  if (!examClassType) {
    return badRequestError(res, 'PleaseProvideExamClassType');
  }
  if (!examType) {
    return badRequestError(res, 'PleaseProvideExamType');
  }

  const examInfo = await Exam_schedule.create({
    ...req.body,
    teacherId: teacherId,
  });

  if (!examInfo) {
    return badRequestError(res, 'SomethingWentWrongPleaseTryAgain');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'ضفنا امتحان ة',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({ data: examInfo, msg: '', authenticatedUser: res.locals.user });
};

const deleteExamInformation = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'PleasePorvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'PleasePorvideValidId');
  }

  const deletedExam = await Exam_schedule.findOneAndDelete({ _id: id });

  if (!deletedExam) {
    return notFoundError(res, 'ThereIsNoSuchExamInDataBase');
  }

  res.json({ data: deletedExam, msg: '', authenticatedUser: res.locals.user });
};

const updateExamInformation = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'PleasePorvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'PleasePorvideValidId');
  }

  const updatedExam = await Exam_schedule.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedExam) {
    return notFoundError(res, 'ThereIsNoSuchExamInDataBase');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'حدثنا جدول الامتحانات شوفوه',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({ data: updatedExam, msg: '', authenticatedUser: res.locals.user });
};

const getTeacherExams = async (req, res) => {
  const teacherId = req.user.userId;
  check_ID(res, teacherId);
  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });
  const teacherExams = await Exam_schedule.find({ teacherId: teacherId });
  notFoundError2(res, teacherExams, 'ThereIsNoExamsFromThisTeacher');

  res.json({ data: teacherExams, msg: '', authenticatedUser: res.locals.user });
};

module.exports = {
  getALLExamsScheduled,
  getMyExams,
  createExamInfo,
  deleteExamInformation,
  updateExamInformation,
  getTeacherExams,
};
