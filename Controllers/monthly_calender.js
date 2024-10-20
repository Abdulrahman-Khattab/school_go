const { badRequestError, notFoundError } = require('../errors_2');
const Monthly_calender = require('../model/monthly_calender');
const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');
const mongoose = require('mongoose');
const create_notification = require('../utility/create_notification');

const createCalenderNote = async (req, res) => {
  const { schoolNote, classesNote, studentNote, teacherNote, note, noteTime } =
    req.body;

  if (!note) {
    return badRequestError(res, 'PleaseProvideCalenderNote');
  }

  if (!noteTime) {
    return badRequestError(res, 'PleaseProvideCalenderNoteTime');
  }

  const calenderNote = await Monthly_calender.create(req.body);

  if (!calenderNote) {
    return badRequestError(res, 'SomethingWentWrongPleaseTryAgainLater');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'Create monthly_calender',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({ data: calenderNote, msg: '', authenticatedUser: res.locals.user });
};

const getAllMonthlyCalenderNote = async (req, res) => {
  const monthlyCalenderNotes = await Monthly_calender.find({});
  if (!monthlyCalenderNotes) {
    return badRequestError(res, 'ThereNoCalenderNotesFound');
  }

  res.json({
    data: monthlyCalenderNotes,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getMyCalenderInfo = async (req, res) => {
  const userId = req.user.userId;
  let finalData = [];
  let userInfo;
  userInfo = await CONTROLLER_SCHEMA.findOne({ _id: userId });

  if (!userInfo) {
    userInfo = await TEACHER_SCHEMA.findOne({ _id: userId });
  }

  if (!userInfo) {
    userInfo = await STUDENT_SCHEMA.findOne({ _id: userId });
  }

  if (!userInfo) {
    return notFoundError(res, 'thisUserDoesNotExist');
  }
  //================================================

  let monthlyCalenderNotes = await Monthly_calender.find({
    schoolNote: true,
  }).select('note noteTime -_id');
  if (monthlyCalenderNotes) {
    finalData.push(monthlyCalenderNotes);
  }

  //================================================

  //================================================
  monthlyCalenderNotes = await Monthly_calender.find({
    studentNote: { $ne: [] },
  }).select('note noteTime studentNote -_id');

  monthlyCalenderNotes.forEach((calenderNote) => {
    if (calenderNote.studentNote.includes(userInfo.username)) {
      finalData.push({
        note: calenderNote.note,
        noteTime: calenderNote.noteTime,
      });
    }
  });
  //================================================

  //================================================
  monthlyCalenderNotes = await Monthly_calender.find({
    teacherNote: { $ne: [] },
  }).select('note noteTime teacherNote -_id');

  monthlyCalenderNotes.forEach((calenderNote) => {
    if (calenderNote.teacherNote.includes(userInfo.username)) {
      finalData.push({
        note: calenderNote.note,
        noteTime: calenderNote.noteTime,
      });
    }
  });
  //================================================

  //================================================
  monthlyCalenderNotes = await Monthly_calender.find({
    classesNote: { $ne: [] },
  }).select('note noteTime studentNote classesNote  -_id');

  console.log(monthlyCalenderNotes);

  monthlyCalenderNotes.forEach((calenderNote) => {
    if (!calenderNote.studentNote.includes(userInfo.username)) {
      calenderNote.classesNote.forEach((classNote) => {
        if (classNote.className != '' && classNote.classTypes.length != 0) {
          if (
            classNote.className == userInfo.className &&
            classNote.classTypes.includes(userInfo.classType)
          ) {
            finalData.push({
              note: calenderNote.note,
              noteTime: calenderNote.noteTime,
            });
            return;
          }
        }

        if (classNote.className != '' && classNote.classTypes.length == 0) {
          if (classNote.className == userInfo.className) {
            finalData.push({
              note: calenderNote.note,
              noteTime: calenderNote.noteTime,
            });
            return;
          }
        }
      });
    }
  });

  //================================================

  finalData = finalData.flat();
  res.json({
    data: { finalData },
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteMonthlyCalenderNote = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'PleasePorvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'PleasePorvideValidId');
  }

  const deleteMonthlyCalenderNote = await Monthly_calender.findOneAndDelete({
    _id: id,
  });

  if (!deleteMonthlyCalenderNote) {
    return notFoundError(res, 'ThereIsNoSuchMonthlyCalenderNoteInDataBase');
  }

  res.json({
    data: deleteMonthlyCalenderNote,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateMonthlyCalenderNote = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'PleasePorvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'PleasePorvideValidId');
  }

  const updateMonthlyCalenderNote = await Monthly_calender.findOneAndUpdate(
    {
      _id: id,
    },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!updateMonthlyCalenderNote) {
    return notFoundError(res, 'ThereIsNoSuchMonthlyCalenderNoteInDataBase');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'Update monthly_calender',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({
    data: updateMonthlyCalenderNote,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createCalenderNote,
  getAllMonthlyCalenderNote,
  getMyCalenderInfo,
  deleteMonthlyCalenderNote,
  updateMonthlyCalenderNote,
};
