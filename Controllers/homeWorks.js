const mongoose = require('mongoose');
const Homework = require('../model/homeWorks');
const { notFoundError, badRequestError } = require('../errors_2');
const TEACHER_SCHEMA = require('../model/user_teacher');
const STUDENT_SCHEMA = require('../model/user_students');
const check_ID = require('../utility/check_ID');
const create_notification = require('../utility/create_notification');

const createHomeWork = async (req, res) => {
  let allowedClasses = [];
  let classTypes = [];
  let className;
  req.body.userId = req.user.userId;
  const {
    classHomework,
    classes,
    classTypesHomeWork,
    description,
    deadLine,
    userId,
    subjectIcon,
  } = req.body;

  if (!classHomework) {
    return badRequestError(res, 'PleaseProvideClass');
  }

  if (!description) {
    return badRequestError(res, 'PleaseProvideDescription');
  }

  if (!classTypesHomeWork) {
    return badRequestError(res, 'PleaseProvideClassTypesHomeWorks');
  }

  if (!deadLine) {
    return badRequestError(res, 'PleaseProvideDeadLine');
  }

  if (!classes) {
    return badRequestError(res, 'PleaseProvideClass');
  }

  if (!subjectIcon) {
    return badRequestError(res, 'pleaseProvideSubjectIcon');
  }

  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: userId });

  teacherInfo.teacherClasses.forEach((teacherClass) => {
    if (
      teacherClass.className == classes &&
      classTypesHomeWork.includes(teacherClass.classType)
    ) {
      allowedClasses.push({
        className: classes,
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
    classTypes.push(allowedClass.classType);
    className = allowedClass.className;
  });

  // console.log(teacherInfo);

  //  console.log(allowedClasses);

  // console.log(classTypes);

  // console.log(className);

  const homeWork = await Homework.create({
    teacherId: userId,
    classHomework: classHomework,
    classes: className,
    classTypesHomeWork: classTypes,
    description: description,
    deadLine: deadLine,
    subjectIcon: subjectIcon,
  });

  if (!homeWork) {
    return badRequestError(
      res,
      'SomethingWrongWithCreatingNewHomeWorkPleaseTryAgainLater'
    );
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'Create homeWork',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({ data: homeWork, msg: '', authenticatedUser: res.locals.user });
};

const getMyHomeWorks = async (req, res) => {
  req.body.userId = req.user.userId;
  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: req.body.userId });

  if (!studentInfo) {
    return notFoundError(res, 'NoSuchStudnetInDataBase');
  }

  const myHomeWorks = await Homework.find({
    classes: studentInfo.className,
    classTypesHomeWork: { $in: [studentInfo.classType] },
    deadLine: { $gt: new Date() },
  }).select('-_id -teacherId -classes -classTypesHomeWork');

  console.log(myHomeWorks);

  /* if (myHomeWorks.length == 0) {
    return notFoundError(res, 'ThereNoHomeWorksAvailable');
  }*/

  res.json({ data: myHomeWorks, msg: '', authenticatedUser: res.locals.user });
};

const getAllHomeWorks = async (req, res) => {
  const homeworks = await Homework.find({});

  if (!homeworks || homeworks.length == 0) {
    return badRequestError(res, 'ThereIsNoHomeWorkInDataBase');
  }

  res.json({ data: homeworks, msg: '', authenticatedUser: res.locals.user });
};

const deleteHomeWork = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const deletedHomework = await Homework.findOneAndDelete({ _id: id });

  if (!deletedHomework) {
    return notFoundError(res, 'pleaseProvideValidId');
  }

  res.json({
    data: deletedHomework,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateHomework = async (req, res) => {
  let classTypes = [];
  let className;
  req.body.userId = req.user.userId;
  const updatedData = {};

  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const {
    classHomework,
    classes,
    classTypesHomeWork,
    description,
    deadLine,
    userId,
    subjectIcon,
  } = req.body;
  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: userId });
  const homeWorkInfo = await Homework.findOne({ _id: id });

  if (classes) {
    teacherInfo.teacherClasses.forEach((teacherClass) => {
      if (teacherClass.className == classes) {
        className = classes;
      }
      return;
    });
  }

  if (classTypesHomeWork) {
    teacherInfo.teacherClasses.forEach((teacherClass) => {
      if (
        classTypesHomeWork.includes(teacherClass.classType) &&
        (teacherClass.className == classes ||
          teacherClass.className == homeWorkInfo.classes)
      ) {
        classTypes.push(teacherClass.classType);
      }
      return;
    });
  }

  if (description) {
    updatedData.description = description;
  }
  if (deadLine) {
    updatedData.deadLine = deadLine;
  }

  if (classes) {
    updatedData.classes = classes;
  }

  if (subjectIcon) {
    updatedData.subjectIcon = subjectIcon;
  }

  if (classHomework) {
    updatedData.classHomework = classHomework;
  }

  updatedData.teacherId = req.user.userId;
  // console.log(teacherInfo);

  //  console.log(allowedClasses);

  if (classTypes && classTypes.length > 0) {
    updatedData.classTypesHomeWork = classTypes;
  }

  //console.log(classTypes);

  //console.log(className);

  if (className) {
    updatedData.classes = className;
  }

  console.log(updatedData);

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'update homeWork',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  const homeWork = await Homework.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!homeWork) {
    return badRequestError(
      res,
      'SomethingWrongWithCreatingNewHomeWorkPleaseTryAgainLater'
    );
  }

  res.json({ data: homeWork, msg: '', authenticatedUser: res.locals.user });
};

const getTeacherHomeworks = async (req, res) => {
  const teacherId = req.user.userId;
  check_ID(res, teacherId);
  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });

  const myHomeWorksInfo = await Homework.find({ teacherId: teacherId });

  res.json({
    data: myHomeWorksInfo,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createHomeWork,
  getMyHomeWorks,
  getAllHomeWorks,
  deleteHomeWork,
  updateHomework,
  getTeacherHomeworks,
};
