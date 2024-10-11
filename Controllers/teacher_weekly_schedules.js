const Teacher_schedule = require('../model/teacher_weekly_schedules');
const TEACHER_SCHEMA = require('../model/user_teacher');
const {
  notFoundError,
  badRequestError,
  notFoundError2,
} = require('../errors_2');

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
