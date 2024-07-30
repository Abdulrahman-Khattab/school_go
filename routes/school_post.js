const {
  createSchoolPost,
  getAllSchoolPost,
  getSingleSchoolPost,
  deleteSchoolPost,
} = require('../Controllers/school_post');

const express = require('express');
const { authenticaiton } = require('../middleware/authentication');

const Router = express.Router();

Router.get('/', authenticaiton, getAllSchoolPost);
Router.get('/:id', getSingleSchoolPost);
Router.post('/', createSchoolPost);
Router.delete('/:id', deleteSchoolPost);

module.exports = Router;
