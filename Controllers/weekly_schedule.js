const mongoose = require('mongoose');
const { badRequestError, notFoundError } = require('../errors_2');
const Weekly_schedule = require('../model/weekly_schedule');
const STUDENT_SCHEMA = require('../model/user_students');
const create_notification = require('../utility/create_notification');

const createWeeklySchedule = async (req, res) => {
  const {
    sunday,
    monday,
    tuseday,
    wednesday,
    thursday,
    friday,
    saturday,
    className,
    classType,
  } = req.body;
  if (!sunday || sunday.length < 1) {
    return badRequestError(res, 'pleaseProvideSundayLessons');
  }

  if (!monday || monday.length < 1) {
    return badRequestError(res, 'pleaseProvideMondayLessons');
  }

  if (!tuseday || tuseday.length < 1) {
    return badRequestError(res, 'pleaseProvideTusedayLessons');
  }

  if (!wednesday || wednesday.length < 1) {
    return badRequestError(res, 'pleaseProvideWednesdayLessons');
  }

  if (!thursday || thursday.length < 1) {
    return badRequestError(res, 'pleaseProvideThursdayLessons');
  }

  /* if (!friday || friday.length < 1) {
    return badRequestError(res, 'pleaseProvideFridayLessons');
  }

  if (!saturday || saturday.length < 1) {
    return badRequestError(res, 'pleaseProvideSaturdayLessons');
  } */

  if (!className) {
    return badRequestError(res, 'PleaseProvideClassName');
  }

  if (!classType) {
    return badRequestError(res, 'PleaseProvideClassType');
  }

  const weeklySchedule = await Weekly_schedule.create(req.body);

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'create student weekly schedules ',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({
    data: weeklySchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getAllWeekSchedule = async (req, res) => {
  const weeklySchedule = await Weekly_schedule.find({});

  if (!weeklySchedule) {
    return notFoundError(res, 'ThereIsNoScheduleInDatabase');
  }

  res.json({
    data: weeklySchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getMyWeeklySchedule = async (req, res) => {
  req.body.userId = req.user.userId;

  const { userId } = req.body;

  if (!userId) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: userId });

  if (!studentInfo) {
    return notFoundError(res, 'ThereNoSuchStudentInfoInDataBase');
  }

  const studentInfoQuery = {
    className: studentInfo.className,
    classType: studentInfo.classType,
  };

  const studentWeeklySchedule = await Weekly_schedule.findOne(studentInfoQuery);

  if (!studentWeeklySchedule) {
    return notFoundError(res, 'ThereIsNoSuchScheduleInDataBase');
  }
  res.json({
    data: studentWeeklySchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteWeeklySchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const weeklySchedule = await Weekly_schedule.findOneAndDelete({ _id: id });

  if (!weeklySchedule) {
    return notFoundError(res, 'pleaseProvideValidId');
  }

  res.json({
    data: weeklySchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateWeeklySchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }
  if (!req.body) {
    return badRequestError(res, 'pleaseProvideTheUpdateValue');
  }

  const weeklySchedule = await Weekly_schedule.findByIdAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!weeklySchedule) {
    return notFoundError(res, 'pleaseProvideValidId');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'create update weekly schedules ',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({
    data: weeklySchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createWeeklySchedule,
  getAllWeekSchedule,
  getMyWeeklySchedule,
  deleteWeeklySchedule,
  updateWeeklySchedule,
};
