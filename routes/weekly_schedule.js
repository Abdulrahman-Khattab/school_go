const {
  getAllWeekSchedule,
  getMyWeeklySchedule,
  deleteWeeklySchedule,
  updateWeeklySchedule,
  createWeeklySchedule,
} = require('../Controllers/weekly_schedule');

const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.get('/AllSchedules', authenticaiton, getAllWeekSchedule);
Router.get('/', authenticaiton, getMyWeeklySchedule);
Router.post('/', authenticaiton, createWeeklySchedule);
Router.delete('/:id', authenticaiton, deleteWeeklySchedule);
Router.patch('/:id', authenticaiton, updateWeeklySchedule);

module.exports = Router;
