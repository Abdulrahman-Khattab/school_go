const Teacher_schedule = require('../model/teacher_weekly_schedules');
const TEACHER_SCHEMA = require('../model/user_teacher');
const {
  notFoundError,
  badRequestError,
  notFoundError2,
} = require('../errors_2');

const create_notification = require('../utility/create_notification');

const check_ID = require('../utility/check_ID');

const createTeacherWeeklySchedules = async (req, res) => {
  const { teacherUsername } = req.body;
  const validTeacher = await TEACHER_SCHEMA.findOne({
    username: teacherUsername,
  });

  if (!validTeacher) {
    return notFoundError(res, 'ThereNoSuchTeacher');
  }

  const teacherSchedule = await Teacher_schedule.create(req.body);

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'create teacher weekly schedules ',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({
    data: teacherSchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getAllTeachersWeeklySchedules = async (req, res) => {
  const teachersSchedules = await Teacher_schedule.find({});

  res.json({
    data: teachersSchedules,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getMyTeacherWeeklySchedules = async (req, res) => {
  const teacherUsername = req.user.username;

  const validTeacher = await TEACHER_SCHEMA.findOne({
    username: teacherUsername,
  });

  if (!validTeacher) {
    return notFoundError(res, 'ThereNoSuchTeacher');
  }

  const myTeacherSchedule = await Teacher_schedule.findOne({
    teacherUsername: teacherUsername,
  });

  if (!myTeacherSchedule) {
    return notFoundError(res, 'NoScheduleForThisTeacherYet');
  }

  res.json({
    data: myTeacherSchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteTeacherWeeklySchedules = async (req, res) => {
  const { id } = req.params;
  check_ID(res, id);

  const deletedTeacherSchedule = await Teacher_schedule.findOneAndDelete({
    _id: id,
  });

  if (!deletedTeacherSchedule) {
    return badRequestError(res, 'ThereNoScheduleInDataBaseToBeDeleted');
  }
  res.json({
    data: deletedTeacherSchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateTeacherWeeklySchedules = async (req, res) => {
  const { id } = req.params;

  check_ID(res, id);

  if (!req.body) {
    return badRequestError(res, 'ThereIsNothingToUpdate');
  }

  const updatedteacherSchedule = await Teacher_schedule.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true, runValidators: true }
  );

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'update teacher weekly schedules ',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({
    data: updatedteacherSchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createTeacherWeeklySchedules,
  getAllTeachersWeeklySchedules,
  getMyTeacherWeeklySchedules,
  deleteTeacherWeeklySchedules,
  updateTeacherWeeklySchedules,
};
