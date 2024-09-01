const {
  createSchoolPost,
  getAllSchoolPost,
  getSingleSchoolPost,
  deleteSchoolPost,
  updatePost,
} = require('../Controllers/school_post');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');

const Router = express.Router();

Router.get('/', authenticaiton, getAllSchoolPost);
Router.get('/:id', authenticaiton, getSingleSchoolPost);
Router.post('/', authenticaiton, createSchoolPost);
Router.delete('/:id', authenticaiton, deleteSchoolPost);
Router.patch('/:id', authenticaiton, updatePost);

module.exports = Router;
