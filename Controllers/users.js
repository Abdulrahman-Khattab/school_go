const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const generateRandomString = require('../utility/randomGenerator');

// Check if the default app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

const {
  badRequestError,
  notFoundError,
  unauthenticatedError,
  unauthrizedError,
} = require('../errors_2');

const { attachCookieToResponse } = require('../utility/jwt');
const createUserToken = require('../utility/createTokenUser');

//============================
//STUDENTS FUNCTIONS
//============================

//==============================================

const getSingleStudents = async (req, res) => {
  res.send('hello single  student');
};
//==============================================

const deleteStudent = async (req, res) => {
  res.send('hello deleteStudents  student');
};
//==============================================

const updateStudent = async (req, res) => {
  res.send('hello updateStudent  student');
};
//==============================================

const studentVacationRequest = async (req, res) => {
  res.send('hello vacation request student');
};

//============================
//TEACHERS FUNCTIONS
//============================

//==============================================

const getSingleTeachers = async (req, res) => {
  res.send('hello single  Teacher');
};
//==============================================

const deleteTeacher = async (req, res) => {
  res.send('hello deleteTeachers  Teacher');
};
//==============================================

const updateTeacher = async (req, res) => {
  res.send('hello updateTeacher  Teacher');
};
//==============================================

const teacherVacationRequest = async (req, res) => {
  res.send('hello vacation request Teacher');
};

//============================
//CONTROLERS FUNCTIONS
//============================
const getAllUsers = async (req, res) => {
  const data = {};

  const students = await STUDENT_SCHEMA.find({});

  if (students) {
    data.students = students;
  }

  const teachers = await TEACHER_SCHEMA.find({});

  if (teachers) {
    data.teachers = teachers;
  }

  const controllers = await CONTROLLER_SCHEMA.find({});

  if (controllers) {
    data.controllers = controllers;
  }

  if (!data) {
    return badRequestError(
      res,
      'there is problem in your database please reset if not worked contact the develeoper'
    );
  }

  res.json({ data, msg: '' });
};

//==============================================
const createStudentAccount = async (req, res) => {
  const {
    name,
    username,
    password,
    age,
    phoneNumber,
    className,
    classType,
    student_parents,
  } = req.body;

  // console.log(req.body);

  if (!name) {
    return badRequestError(res, 'please provide name ');
  }
  if (!username) {
    return badRequestError(res, 'please provide username ');
  }

  if (!password) {
    return badRequestError(res, 'please provide password ');
  }

  if (!age) {
    return badRequestError(res, 'please provide age ');
  }
  if (!phoneNumber) {
    return badRequestError(res, 'please provide phoneNumber ');
  }
  if (!className) {
    return badRequestError(res, 'please provide className ');
  }
  if (!classType) {
    return badRequestError(res, 'please provide classType ');
  }
  if (!student_parents) {
    return badRequestError(res, 'please provide student_parents ');
  }

  const randomValue = generateRandomString(10);

  if (req.files) {
    const imageValue = req.files.image;

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'please provide image');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(
        res,
        'please provide image that size is less than 5MB'
      );
    }

    const imagePath = path.join(
      __dirname,
      `../public/usersImage/`,
      `${imageValue.name}`
    );
    await imageValue.mv(imagePath);

    const downloadToken = uuidv4(); // Generate a unique token
    try {
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
        contentType: imageValue.mimetype,
      };

      await bucket.upload(imagePath, {
        destination: `public/usersImage/${randomValue + imageValue.name}`,
        metadata: metadata,
      });

      const file = bucket.file(
        `public/usersImage/${randomValue + imageValue.name}`
      );
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;

      const user = await STUDENT_SCHEMA.create({
        ...req.body,
        image: imageUrl,
      });

      const token = createUserToken(user);

      attachCookieToResponse({ res, user: token });

      res.json({ data: token, msg: '' });
    } catch (error) {
      console.error(error);
      return badRequestError(res, 'Failed to upload image to Firebase Storage');
    } finally {
      fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
    }
  }

  const user = await STUDENT_SCHEMA.create({ ...req.body });

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });

  res.json({ data: token, msg: '' });
};
//==============================================

const createTeacherAccount = async (req, res) => {
  const { name, username, password, phoneNumber, teacherClasses } = req.body;

  console.log(req.body);

  if (!name) {
    return badRequestError(res, 'please provide name ');
  }
  if (!username) {
    return badRequestError(res, 'please provide username ');
  }

  if (!password) {
    return badRequestError(res, 'please provide password ');
  }

  if (!phoneNumber) {
    return badRequestError(res, 'please provide phoneNumber ');
  }

  if (!teacherClasses) {
    return badRequestError(res, 'please provide teacher classes ');
  }

  if (req.files) {
    const imageValue = req.files.image;
    const randomValue = generateRandomString(10);

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'please provide image');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(
        res,
        'please provide image that size is less than 5MB'
      );
    }

    const imagePath = path.join(
      __dirname,
      `../public/usersImage/`,
      `${imageValue.name}`
    );
    await imageValue.mv(imagePath);

    const downloadToken = uuidv4(); // Generate a unique token
    try {
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
        contentType: imageValue.mimetype,
      };

      await bucket.upload(imagePath, {
        destination: `public/usersImage/${randomValue + imageValue.name}`,
        metadata: metadata,
      });

      const file = bucket.file(
        `public/usersImage/${randomValue + imageValue.name}`
      );
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;

      const user = await TEACHER_SCHEMA.create({
        ...req.body,
        image: imageUrl,
      });

      const token = createUserToken(user);

      attachCookieToResponse({ res, user: token });

      res.json({ data: token, msg: '' });
    } catch (error) {
      console.error(error);
      return badRequestError(res, 'Failed to upload image to Firebase Storage');
    } finally {
      fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
    }
  }

  const user = await TEACHER_SCHEMA.create({ ...req.body });

  const token = createUserToken(user);
  attachCookieToResponse({ res, user: token });

  res.json({ data: token, msg: '' });
};
//==============================================

const createControllerAccount = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name) {
    return badRequestError(res, 'please provide name ');
  }
  if (!username) {
    return badRequestError(res, 'please provide username ');
  }
  if (!password) {
    return badRequestError(res, 'please provide password ');
  }

  const randomValue = generateRandomString(10);

  if (req.files) {
    const imageValue = req.files.image;

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'please provide image');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(
        res,
        'please provide image that size is less than 5MB'
      );
    }

    const imagePath = path.join(
      __dirname,
      `../public/usersImage/`,
      `${imageValue.name}`
    );
    await imageValue.mv(imagePath);

    const downloadToken = uuidv4(); // Generate a unique token
    try {
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
        contentType: imageValue.mimetype,
      };

      await bucket.upload(imagePath, {
        destination: `public/usersImage/${randomValue + imageValue.name}`,
        metadata: metadata,
      });

      const file = bucket.file(
        `public/usersImage/${randomValue + imageValue.name}`
      );
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;

      const user = await CONTROLLER_SCHEMA.create({
        ...req.body,
        image: imageUrl,
      });

      const token = createUserToken(user);

      attachCookieToResponse({ res, user: token });

      res.json({ data: token, msg: '' });
    } catch (error) {
      console.error(error);
      return badRequestError(res, 'Failed to upload image to Firebase Storage');
    } finally {
      fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
    }
  }

  const user = await CONTROLLER_SCHEMA.create({
    ...req.body,
  });

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });

  res.json({ data: token, msg: '' });
};

//==============================================

const updateControllerAccount = async (req, res) => {
  res.send('hello update Account controller');
};
//==============================================

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'please provide id');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'please provide correct ID');
  }

  let deletedUser;

  deletedUser = await STUDENT_SCHEMA.findOneAndDelete({ _id: id });
  if (!deletedUser) {
    deletedUser = await TEACHER_SCHEMA.findOneAndDelete({ _id: id });
  }
  if (!deletedUser) {
    deletedUser = await CONTROLLER_SCHEMA.findOneAndDelete({ _id: id });
  }
  if (!deletedUser) {
    return notFoundError(res, 'There no such user in database');
  }

  res.json({ data: deletedUser, msg: '' });
};

//==============================================

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return badRequestError(res, 'Please provide username');
  }

  if (!password) {
    return badRequestError(res, 'please provide password');
  }

  let user = null;

  user = await CONTROLLER_SCHEMA.findOne({ username });
  if (!user) {
    user = await TEACHER_SCHEMA.findOne({ username });
  }

  if (!user) {
    user = await STUDENT_SCHEMA.findOne({ username });
  }

  if (!user) {
    return notFoundError(res, 'This user does not exist');
  }

  const isPasswordcorrect = await user.comparePassword(password);

  if (!isPasswordcorrect) {
    return unauthenticatedError(res, 'please provide correct password ');
  }

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });

  res.json({ data: token, msg: '' });
};

module.exports = {
  getSingleStudents,
  deleteStudent,
  updateStudent,
  studentVacationRequest,
  getSingleTeachers,
  deleteTeacher,
  updateTeacher,
  teacherVacationRequest,
  createStudentAccount,
  createTeacherAccount,
  createControllerAccount,
  updateControllerAccount,
  deleteAccount,
  login,
  getAllUsers,
};
