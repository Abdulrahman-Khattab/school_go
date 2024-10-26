const Installment = require('../model/installment');
const STUDENT_SCHEMA = require('../model/user_students');
const notFoundCheck = require('../utility/not_foundCheck');
const badRequestCheck = require('../utility/bad_requestCheck');
const check_ID = require('../utility/check_ID');
const createInstallment = async (req, res) => {
  const {
    username,
    prcentageDisscount,
    constantDisscount,
    totalPayment,
    currentPayment,
    totalPaymentAfterDisscount,
  } = req.body;
  let totalPaymentInNumber;
  await badRequestCheck(res, username, 'PleaseProvideUsername');
  await badRequestCheck(res, totalPayment, 'PleaseProvidetotalPayment');
  await badRequestCheck(res, currentPayment, 'PleaseProvidecurrentPayment');

  const validStudentUserName = await STUDENT_SCHEMA.findOne({
    username: username,
  });

  await badRequestCheck(
    res,
    validStudentUserName,
    'ThereIsNoSuchStudentInSchool'
  );

  switch (totalPayment) {
    case 'الأول':
      totalPaymentInNumber = 1000000;
      break;

    case 'الثاني':
      totalPaymentInNumber = 1200000;
      break;
    case 'الثالث':
      totalPaymentInNumber = 1400000;
      break;

    case 'الرابع':
      totalPaymentInNumber = 1600000;
      break;

    case 'الخامس':
      totalPaymentInNumber = 1800000;
      break;

    case 'السادس':
      totalPaymentInNumber = 1800000;
      break;

    default:
      totalPaymentInNumber = 0;
      break;
  }

  let discountPayment =
    totalPaymentInNumber -
    (constantDisscount ? constantDisscount : 0) -
    totalPaymentInNumber *
      ((prcentageDisscount ? prcentageDisscount : 0) / 100);

  const installment = await Installment.create({
    username: username,
    prcentageDisscount: prcentageDisscount,
    constantDisscount: constantDisscount,
    totalPayment: totalPaymentInNumber,
    currentPayment: currentPayment,
    totalPaymentAfterDisscount: discountPayment,
  });

  await badRequestCheck(
    res,
    installment,
    'SomethingWrongHappenWhileMakingYourInstallment'
  );

  res.json({
    data: installment,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getAllInstallment = async (req, res) => {
  const getAllStudentsInstallments = await Installment.find({});
  await notFoundCheck(
    res,
    getAllInstallment,
    'ThereIsNoInstallmentInTheDataBase'
  );

  res.json({
    data: getAllStudentsInstallments,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getMyInstallment = async (req, res) => {
  const { username } = req.user;

  const myInstallment = await Installment.find({ username: username });
  await badRequestCheck(res, myInstallment, 'NoInstallmentForThisUser');
  res.json({
    data: getAllStudentsInstallments,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteInstallemnt = async (req, res) => {
  res.send('delete my installment');
};

const updateInstallment = async (req, res) => {
  const { id } = req.params;
  check_ID(res, id);

  const {
    username,
    prcentageDisscount,
    constantDisscount,
    currentPayment,
    totalPayment,
  } = req.body;
  let totalPaymentInNumber;
  let finalPaymentUpdate;

  if (username) {
    const validUser = await STUDENT_SCHEMA.findOne({ username: username });
    await notFoundCheck(res, validUser, 'ThisUserNameNotValid');
  }

  if (totalPayment) {
    switch (totalPayment) {
      case 'الأول':
        totalPaymentInNumber = 1000000;
        break;

      case 'الثاني':
        totalPaymentInNumber = 1200000;
        break;
      case 'الثالث':
        totalPaymentInNumber = 1400000;
        break;

      case 'الرابع':
        totalPaymentInNumber = 1600000;
        break;

      case 'الخامس':
        totalPaymentInNumber = 1800000;
        break;

      case 'السادس':
        totalPaymentInNumber = 1800000;
        break;

      default:
        totalPaymentInNumber = 0;
        break;
    }
  }

  const installmentRecord = await Installment.findOne({ _id: id });
  const totalRecordedPayment = installmentRecord.totalPayment;

  if (totalPayment) {
    finalPaymentUpdate =
      totalPaymentInNumber -
      (constantDisscount ? constantDisscount : 0) -
      totalPaymentInNumber *
        ((prcentageDisscount ? prcentageDisscount : 0) / 100);
  } else {
    finalPaymentUpdate =
      totalRecordedPayment -
      (constantDisscount ? constantDisscount : 0) -
      totalRecordedPayment *
        ((prcentageDisscount ? prcentageDisscount : 0) / 100);
  }
};

module.exports = {
  createInstallment,
  getAllInstallment,
  getMyInstallment,
  deleteInstallemnt,
  updateInstallment,
};