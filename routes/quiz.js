const {
  createQuiz,
  getMyQuiz,
  getAllQuizes,
  deleteQuiz,
  updateQuiz,
  getTeacherQuiz,
} = require('../Controllers/quiz');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createQuiz);
Router.get('/getAllQuizes', authenticaiton, getAllQuizes);
Router.get('/teacherQuizes', authenticaiton, getTeacherQuiz);
Router.get('/', authenticaiton, getMyQuiz);
Router.delete('/:id', authenticaiton, deleteQuiz);
Router.patch('/:id', authenticaiton, updateQuiz);

module.exports = Router;
