const {
  getAllNotifications,
  getMyNotifications,
  deleteNotifications,
} = require('../Controllers/notifications');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.get('/', authenticaiton, getAllNotifications);
Router.get('/myNotifications', authenticaiton, getMyNotifications);
Router.delete('/:id', deleteNotifications);

module.exports = Router;
