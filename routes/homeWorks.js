const {
  createHomeWork,
  getMyHomeWorks,
  getAllHomeWorks,
  deleteHomeWork,
} = require('../Controllers/homeWorks');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createHomeWork);
Router.get('/getAllHomeworks', authenticaiton, getAllHomeWorks);
Router.get('/', authenticaiton, getMyHomeWorks);
Router.delete('/:id', authenticaiton, deleteHomeWork);

module.exports = Router;
