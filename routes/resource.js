const {
  createResource,
  getMyResource,
  getAllResources,
  deleteResource,
} = require('../Controllers/resource');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createResource);
Router.get('/getAllResources', authenticaiton, getAllResources);
Router.get('/', authenticaiton, getMyResource);
Router.delete('/:id', authenticaiton, deleteResource);

module.exports = Router;
