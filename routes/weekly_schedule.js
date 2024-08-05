const {
  getAllWeekSchedule,
  getSingleDaySchedule,
  deleteWeeklySchedule,
  updateWeeklySchedule,
  createWeeklySchedule,
} = require('../Controllers/weekly_schedule');

const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.get('/', authenticaiton, getAllWeekSchedule);
Router.get('/:id', authenticaiton, getSingleDaySchedule);
Router.post('/', authenticaiton, createWeeklySchedule);
Router.delete('/:id', authenticaiton, deleteWeeklySchedule);
Router.patch('/:id', authenticaiton, updateWeeklySchedule);

module.exports = Router;
