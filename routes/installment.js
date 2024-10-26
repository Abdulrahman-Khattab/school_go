const {
  createInstallment,
  getAllInstallment,
  getMyInstallment,
  deleteInstallemnt,
  updateInstallment,
} = require('../Controllers/installment');

const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createInstallment);
Router.get('/', authenticaiton, getAllInstallment);
Router.get('/myInstallment', authenticaiton, getMyInstallment);
Router.delete('/:id', authenticaiton, deleteInstallemnt);
Router.patch('/:id', authenticaiton, updateInstallment);

module.exports = Router;
