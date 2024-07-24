const {
  createSchoolPost,
  getAllSchoolPost,
  getSingleSchoolPost,
  deleteSchoolPost,
} = require('../Controllers/school_post');

const express = require('express');

const Router = express.Router();

Router.get('/', getAllSchoolPost);
Router.get('/:id', getSingleSchoolPost);
Router.post('/', createSchoolPost);
Router.delete('/:id', deleteSchoolPost);

module.exports = Router;
