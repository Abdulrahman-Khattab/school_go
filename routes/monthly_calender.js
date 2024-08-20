const {
  createCalenderNote,
  getAllMonthlyCalenderNote,
  getMyCalenderInfo,
} = require('../Controllers/monthly_calender');
const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createCalenderNote);
Router.get(
  '/getAllMonthlyCalenderNote',
  authenticaiton,
  getAllMonthlyCalenderNote
);
Router.get('/', authenticaiton, getMyCalenderInfo);

module.exports = Router;
