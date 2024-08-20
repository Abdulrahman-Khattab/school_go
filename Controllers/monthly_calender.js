const { badRequestError } = require('../errors_2');
const Monthly_calender = require('../model/monthly_calender');
const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');
const mongoose = require('mongoose');

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

module.exports = {
  createCalenderNote,
  getAllMonthlyCalenderNote,
  getMyCalenderInfo,
};
