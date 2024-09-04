const {
  getMyExams,
  createExamInfo,
  deleteExamInformation,
  updateExamInformation,
  getALLExamsScheduled,
  getTeacherExams,
} = require('../Controllers/exam_schedule');
const express = require('express');
const { authenticaiton } = require('../middleware/authentication');
const Router = express.Router();

Router.get('/getExams', authenticaiton, getALLExamsScheduled);
Router.get('/teacherExams', authenticaiton, getTeacherExams);
Router.get('/', authenticaiton, getMyExams);
Router.post('/', authenticaiton, createExamInfo);
Router.delete('/:id', authenticaiton, deleteExamInformation);
Router.patch('/:id', authenticaiton, updateExamInformation);

module.exports = Router;
