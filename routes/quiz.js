const {
  createQuiz,
  getMyQuiz,
  getAllQuizes,
  deleteQuiz,
} = require('../Controllers/quiz');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createQuiz);
Router.get('/getAllQuizes', authenticaiton, getAllQuizes);
Router.get('/', authenticaiton, getMyQuiz);
Router.delete('/:id', authenticaiton, deleteQuiz);

module.exports = Router;
