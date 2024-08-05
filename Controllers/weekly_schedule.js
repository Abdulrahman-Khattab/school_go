const mongoose = require('mongoose');
const { badRequestError, notFoundError } = require('../errors_2');
const Weekly_schedule = require('../model/weekly_schedule');

const createWeeklySchedule = async (req, res) => {
  const { sunday, monday, tuseday, wednesday, thursday, friday, saturday } =
    req.body;
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

  const weeklySchedule = await Weekly_schedule.create(req.body);

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

const getSingleDaySchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const weeklySchedule = await Weekly_schedule.findOne({ _id: id });

  if (!weeklySchedule) {
    return notFoundError(res, 'pleaseProvideValidId');
  }

  res.json({
    data: weeklySchedule,
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

  res.json({
    data: weeklySchedule,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createWeeklySchedule,
  getAllWeekSchedule,
  getSingleDaySchedule,
  deleteWeeklySchedule,
  updateWeeklySchedule,
};
