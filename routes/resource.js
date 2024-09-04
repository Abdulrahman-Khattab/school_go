const {
  createResource,
  getMyResource,
  getAllResources,
  deleteResource,
  updateResource,
  teacherResource,
} = require('../Controllers/resource');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createResource);
Router.get('/getAllResources', authenticaiton, getAllResources);
Router.get('/teacherResource', authenticaiton, teacherResource);
Router.get('/', authenticaiton, getMyResource);
Router.delete('/:id', authenticaiton, deleteResource);
Router.patch('/:id', authenticaiton, updateResource);

module.exports = Router;
