const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');
const VACATION_SCHEMA = require('../model/vaction');
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
//GENERAL FUNCTION
//============================

//==============================================

const vacationRequest = async (req, res) => {
  req.body.senderId = req.user.userId;
  req.body.senderRole = req.user.role;
  req.body.senderUsername = req.user.username;
  req.body.senderName = req.user.name;
  const { senderDescription, vacationStartTime, vacationEndTime } = req.body;

  if (!senderDescription) {
    return badRequestError(res, 'please provide sender description');
  }

  if (!vacationStartTime) {
    return badRequestError(res, 'Please provide vacation start time ');
  }

  if (!vacationEndTime) {
    return badRequestError(res, 'Please provide vacation end time ');
  }

  const vacation = await VACATION_SCHEMA.create({ ...req.body });

  res.json({ data: vacation, msg: '' });
};

const checkUserInfo = async (req, res) => {
  res.json({ data: res.locals.user, msg: '' });
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

  let user;
  let userVacations;

  user = await CONTROLLER_SCHEMA.findOne({ username });

  if (!user) {
    user = await TEACHER_SCHEMA.findOne({ username });
  }

  if (!user) {
    user = await STUDENT_SCHEMA.findOne({ username });
    console.log(user);
  }

  if (!user) {
    return notFoundError(res, 'This user does not exist');
  }

  const isPasswordcorrect = await user.comparePassword(password);

  if (!isPasswordcorrect) {
    return unauthenticatedError(res, 'please provide correct password ');
  }

  userVacations = await VACATION_SCHEMA.find({
    senderUsername: user.username,
  });

  const token = createUserToken({ ...user._doc, vacations: userVacations });

  attachCookieToResponse({ res, user: token });

  res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
};

//==============================================

//============================
//CONTROLERS FUNCTIONS
//============================
const getAllUsers = async (req, res) => {
  const data = {};

  const students = await STUDENT_SCHEMA.find({});
  const studentVacations = await VACATION_SCHEMA.find({
    senderRole: 'student',
  });

  if (students) {
    //data.students = students;

    data.students = students.map((student) => ({
      ...student._doc,
      vacations: studentVacations.filter((vacation) =>
        vacation.senderId.equals(student._id)
      ),
    }));
  }

  const teachers = await TEACHER_SCHEMA.find({});
  const teacherVacations = await VACATION_SCHEMA.find({
    senderRole: 'teacher',
  });
  if (teachers) {
    // data.teachers = teachers;

    data.teachers = teachers.map((teacher) => ({
      ...teachers._doc,
      vacations: teacherVacations.filter((vacation) =>
        vacation.senderId.equals(teacher._id)
      ),
    }));
  }

  const controllers = await CONTROLLER_SCHEMA.find({});
  const controllerVacations = await VACATION_SCHEMA.find({
    senderRole: 'controller',
  });

  if (controllers) {
    data.controllers = controllers.map((controller) => ({
      ...controller._doc,
      vacations: controllerVacations.filter((vaction) =>
        vaction.senderId.equals(controller._id)
      ),
    }));
  }

  if (!data) {
    return badRequestError(
      res,
      'there is problem in your database please reset if not worked contact the develeoper'
    );
  }

  res.json({ data, msg: '', authenticatedUser: res.locals.user });
};
//======================================================
const getWeeklyVacationRequest = async (req, res) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
  endOfWeek.setHours(23, 59, 59, 999);

  const weekVacations = await VACATION_SCHEMA.find({
    createdAt: { $gte: startOfWeek, $lt: endOfWeek },
  });

  if (!weekVacations) {
    return notFoundError(res, 'there is no vacation request for today');
  }

  res.json({
    data: weekVacations,
    msg: '',
    authenticatedUser: res.locals.user,
  });
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

      res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
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

  res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
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

      res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
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

  res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
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

      res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
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

  res.json({ data: token, msg: '', authenticatedUser: res.locals.user });
};

//==============================================

const updateAccount = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'please provide id');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'please provide correct ID');
  }

  let updatedUser;

  if (req.files) {
    let user;
    user = await STUDENT_SCHEMA.findOne({ _id: id });
    if (!user) {
      user = await TEACHER_SCHEMA.findOne({ _id: id });
    }
    if (!user) {
      user = await CONTROLLER_SCHEMA.findOne({ _id: id });
    }
    if (!user) {
      return notFoundError(res, 'There no such user in database');
    }
    //==============================
    // DELETE OLD IMAGE
    //==============================

    if (user && user.image) {
      // Extract the image URL from the deleted post
      const imageUrl = user.image;

      // Extract the file path from the image URL
      const filePath = decodeURIComponent(
        imageUrl.split('/o/')[1].split('?')[0]
      );

      try {
        // Delete the file from Firebase Storage
        await bucket.file(filePath).delete();
        console.log(`Successfully deleted file: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error);
        return badRequestError(
          res,
          'Failed to delete associated image from Firebase Storage'
        );
      }
    }
    //===================================================
    //UPDATE THE RECORD WITH NEW IMAGE
    //===================================================

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

      req.body.image = imageUrl;
    } catch (error) {
      console.error(error);
      return badRequestError(res, 'Failed to upload image to Firebase Storage');
    } finally {
      fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
    }
  }
  updatedUser = await STUDENT_SCHEMA.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedUser) {
    updatedUser = await TEACHER_SCHEMA.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );
  }

  if (!updatedUser) {
    updatedUser = await CONTROLLER_SCHEMA.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );
  }

  if (!updatedUser) {
    return badRequestError(res, 'there no such user in database to be updated');
  }

  const token = createUserToken(updatedUser);

  attachCookieToResponse({ res, user: token });

  res.json({ data: updatedUser, msg: '', authenticatedUser: res.locals.user });
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

  // Extract the image URL from the deleted post
  const imageUrl = deletedUser.image;

  // Extract the file path from the image URL
  const filePath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);

  try {
    // Delete the file from Firebase Storage
    await bucket.file(filePath).delete();
    console.log(`Successfully deleted file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
    return badRequestError(
      res,
      'Failed to delete associated image from Firebase Storage'
    );
  }

  res.json({ data: deletedUser, msg: '', authenticatedUser: res.locals.user });
};

module.exports = {
  vacationRequest,
  getWeeklyVacationRequest,
  createStudentAccount,
  createTeacherAccount,
  createControllerAccount,
  updateAccount,
  deleteAccount,
  login,
  getAllUsers,
  checkUserInfo,
};
