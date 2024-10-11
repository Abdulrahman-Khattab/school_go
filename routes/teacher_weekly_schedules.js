const {
  createTeacherWeeklySchedules,
  getAllTeachersWeeklySchedules,
  getMyTeacherWeeklySchedules,
  deleteTeacherWeeklySchedules,
  updateTeacherWeeklySchedules,
} = require('../Controllers/teacher_weekly_schedules');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');

const Router = express.Router();

Router.post('/', authenticaiton, createTeacherWeeklySchedules);
Router.get('/', authenticaiton, getAllTeachersWeeklySchedules);
Router.get('/teacherSchedule', authenticaiton, getMyTeacherWeeklySchedules); // Need to add authrazation to work fully later
Router.delete('/:id', authenticaiton, deleteTeacherWeeklySchedules);
Router.patch('/:id', authenticaiton, updateTeacherWeeklySchedules);

module.exports = Router;
