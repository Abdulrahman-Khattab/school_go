const {
  createInstallment,
  getAllInstallment,
  getMyInstallment,
  deleteInstallemnt,
  updateInstallment,
  getSingleInstallment,
} = require('../Controllers/installment');

const { authenticaiton } = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.post('/', authenticaiton, createInstallment);
Router.get('/', authenticaiton, getAllInstallment);
Router.get('/myInstallment/info', authenticaiton, getMyInstallment);
//Router.get('/:id', authenticaiton, getSingleInstallment);
Router.delete('/:id', authenticaiton, deleteInstallemnt);
Router.patch('/:id', authenticaiton, updateInstallment);

module.exports = Router;
