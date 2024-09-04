const mongoose = require('mongoose');
const Quiz = require('../model/quiz');
const {
  notFoundError,
  badRequestError,
  notFoundError2,
} = require('../errors_2');
const TEACHER_SCHEMA = require('../model/user_teacher');
const STUDENT_SCHEMA = require('../model/user_students');
const check_ID = require('../utility/check_ID');

const createQuiz = async (req, res) => {
  const teacherId = req.user.userId;
  let allowedClasses = [];
  let classTypesQuiz = [];
  let classNameQuiz;
  const { subject, className, classTypes, quizInformation, subjectIcon } =
    req.body;
  if (!subject) {
    return badRequestError(res, 'PleaseProvideSubject');
  }
  if (!className) {
    return badRequestError(res, 'PleaseProvideClassName');
  }
  if (!classTypes || classTypes.length == 0) {
    return badRequestError(res, 'PleaseProvideClassTypes');
  }
  if (!quizInformation || quizInformation.length == 0) {
    return badRequestError(res, 'PleaseProvideQuizInformation');
  }
  if (!subjectIcon || subjectIcon.length == 0) {
    return badRequestError(res, 'PleaseProvideSubjectIcon');
  }

  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });

  teacherInfo.teacherClasses.forEach((teacherClass) => {
    if (
      teacherClass.className == className &&
      classTypes.includes(teacherClass.classType)
    ) {
      allowedClasses.push({
        className: className,
        classType: teacherClass.classType,
      });
    }

    return;
  });

  if (allowedClasses.length == 0) {
    return badRequestError(
      res,
      `TeacherCanNotAddHomeWorksForClassesThatHeDon'tTeach`
    );
  }

  allowedClasses.forEach((allowedClass) => {
    classTypesQuiz.push(allowedClass.classType);
    classNameQuiz = allowedClass.className;
  });

  const quiz = await Quiz.create({
    teacherId: teacherId,
    subject: subject,
    className: classNameQuiz,
    classTypes: classTypesQuiz,
    quizInformation: quizInformation,
    subjectIcon: subjectIcon,
  });

  if (!quiz) {
    return badRequestError(
      res,
      'SomethingWrongWithCreatingNewQuizPleaseTryAgainLater'
    );
  }

  res.json({ data: quiz, msg: '', authenticatedUser: res.locals.user });
};

const getMyQuiz = async (req, res) => {
  const studentId = req.user.userId;
  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: studentId });
  if (!studentInfo) {
    return notFoundError(res, 'ThisUserDoesNotExist');
  }
  const myQuiz = await Quiz.find({
    className: studentInfo.className,
    classTypes: { $in: [studentInfo.classType] },
  }).select('-_id -className -classTypes -teacherId');

  if (!myQuiz || myQuiz.length == 0) {
    return notFoundError(res, 'ThisStudentDoesNotHaveExistingValidQuiz');
  }

  res.json({ data: myQuiz, msg: '', authenticatedUser: res.locals.user });
};

const getAllQuizes = async (req, res) => {
  const quizes = await Quiz.find({});

  if (!quizes || quizes.length == 0) {
    return badRequestError(res, 'ThereIsNoQuizesInDataBase');
  }

  res.json({ data: quizes, msg: '', authenticatedUser: res.locals.user });
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const deletedQuiz = await Quiz.findOneAndDelete({ _id: id });

  if (!deletedQuiz) {
    return notFoundError(res, 'pleaseProvideValidId');
  }

  res.json({
    data: deletedQuiz,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateQuiz = async (req, res) => {
  let classTypesUpdate = [];
  let classNameUpdate;
  const updatedData = {};

  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const {
    className,
    classTypes,
    subject,
    subjectIcon,
    deadLine,
    quizInformation,
  } = req.body;

  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: req.user.userId });
  const quizInfo = await Quiz.findOne({ _id: id });

  if (className) {
    teacherInfo.teacherClasses.forEach((teacherClass) => {
      if (teacherClass.className == className) {
        classNameUpdate = className;
      }
      return;
    });
    updatedData.className = classNameUpdate;
  }

  if (classTypes || classTypes.length == 0) {
    teacherInfo.teacherClasses.forEach((teacherClass) => {
      if (
        classTypes.includes(teacherClass.classType) &&
        (teacherClass.className == className ||
          teacherClass.className == quizInfo.className)
      ) {
        classTypesUpdate.push(teacherClass.classType);
      }
      return;
    });

    if (classTypesUpdate.length > 0) {
      updatedData.classTypes = classTypesUpdate;
    }
  }

  if (subject) {
    updatedData.subject = subject;
  }
  if (subjectIcon) {
    updatedData.subjectIcon = subjectIcon;
  }
  if (quizInformation) {
    updatedData.quizInformation = quizInformation;
  }

  if (deadLine) {
    updatedData.deadLine = deadLine;
  }

  console.log(updatedData);

  const updatedQuiz = await Quiz.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });

  res.json({
    data: updatedQuiz,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getTeacherQuiz = async (req, res) => {
  const teacherId = req.user.userId;
  check_ID(res, teacherId);
  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });
  const teacherQuiz = await Quiz.find({ teacherId: teacherId });
  notFoundError2(res, teacherQuiz, 'ThisTeacherHaveGivenNoQuiz');
  res.json({
    data: teacherQuiz,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createQuiz,
  getMyQuiz,
  getAllQuizes,
  deleteQuiz,
  updateQuiz,
  getTeacherQuiz,
};
