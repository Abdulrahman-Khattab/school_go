const STUDENT_SCHEMA = require('../model/user_students');
const TEACHER_SCHEMA = require('../model/user_teacher');
const CONTROLLER_SCHEMA = require('../model/user_controller');
const VACATION_SCHEMA = require('../model/vaction');
const StudentMarks = require('../model/student_marks');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const generateRandomString = require('../utility/randomGenerator');
const check_ID = require('../utility/check_ID');

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
const create_notification = require('../utility/create_notification');

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

  console.log(req.body);

  if (!senderDescription) {
    return badRequestError(res, 'pleaseProvideSenderDescription');
  }

  if (!vacationStartTime) {
    return badRequestError(res, 'pleaseProvideVacationStartTime ');
  }

  if (!vacationEndTime) {
    return badRequestError(res, 'pleaseProvideVacationEndTime ');
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
    return badRequestError(res, 'pleaseProvideUsername');
  }

  if (!password) {
    return badRequestError(res, 'pleaseProvidePassword');
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
    return notFoundError(res, 'thisUserDoesNotExist');
  }

  const isPasswordcorrect = await user.comparePassword(password);

  if (!isPasswordcorrect) {
    return unauthenticatedError(res, 'pleaseProvideCorrectPassword ');
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
      ...teacher._doc,
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
      'thereIsProblemInYourDatabasePleaseResetIfNotWorkedContactTheDeveleoper'
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
    return notFoundError(res, 'thereIsNoVacationRequestForToday');
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
    return badRequestError(res, 'pleaseProvideName ');
  }
  if (!username) {
    return badRequestError(res, 'pleaseProvideUsername ');
  }

  if (!password) {
    return badRequestError(res, 'pleaseProvidePassword ');
  }

  if (!age) {
    return badRequestError(res, 'pleaseProvideAge ');
  }
  if (!phoneNumber) {
    return badRequestError(res, 'pleaseProvidePhoneNumber ');
  }
  if (!className) {
    return badRequestError(res, 'pleaseProvideClassName ');
  }
  if (!classType) {
    return badRequestError(res, 'pleaseProvideClassType ');
  }
  if (!student_parents) {
    return badRequestError(res, 'pleaseProvideStudentParents ');
  }

  const randomValue = generateRandomString(10);

  if (req.files) {
    const imageValue = req.files.image;

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'pleaseProvideImage');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(res, 'pleaseProvideImageThatSizeIsLessThan5MB');
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
      return badRequestError(res, 'failedToUploadImageToFirebaseStorage');
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
    return badRequestError(res, 'pleaseProvideName ');
  }
  if (!username) {
    return badRequestError(res, 'pleaseProvideUsername ');
  }

  if (!password) {
    return badRequestError(res, 'pleaseProvidePassword ');
  }

  if (!phoneNumber) {
    return badRequestError(res, 'pleaseProvidePhoneNumber ');
  }

  if (!teacherClasses) {
    return badRequestError(res, 'pleaseProvideTeacherClasses ');
  }

  if (req.files) {
    const imageValue = req.files.image;
    const randomValue = generateRandomString(10);

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'pleaseProvideImage');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(res, 'pleaseProvideImageThatSizeIsLessThan5MB');
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
      return badRequestError(res, 'failedToUploadImageToFirebaseStorage');
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
    return badRequestError(res, 'pleaseProvideName ');
  }
  if (!username) {
    return badRequestError(res, 'pleaseProvideUsername ');
  }
  if (!password) {
    return badRequestError(res, 'pleaseProvidePassword ');
  }

  const randomValue = generateRandomString(10);

  if (req.files) {
    const imageValue = req.files.image;

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'pleaseProvideImage');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(res, 'pleaseProvideImageThatSizeIsLessThan5MB');
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
      return badRequestError(res, 'failedToUploadImageToFirebaseStorage');
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
    return badRequestError(res, 'pleaseProvideID');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideCorrectID');
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
      return notFoundError(res, 'ThereNoSuchUserInDatabase');
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
        console.log(`successfully Deleted File: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error);
        return badRequestError(
          res,
          'failedToDeleteAssociatedImageFromFirebaseStorage'
        );
      }
    }
    //===================================================
    //UPDATE THE RECORD WITH NEW IMAGE
    //===================================================

    const imageValue = req.files.image;
    const randomValue = generateRandomString(10);

    if (!imageValue.mimetype.startsWith('image')) {
      return badRequestError(res, 'pleaseProvideImage');
    }

    const size = 1024 * 1024 * 5;
    if (imageValue.size > size) {
      return badRequestError(res, 'pleaseProvideImageThatSizeIsLessThan5MB');
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
      return badRequestError(res, 'failedToUploadImageToFirebaseStorage');
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
    return badRequestError(res, 'thereNoSuchUserInDatabaseToBeUpdated');
  }

  const token = createUserToken(updatedUser);

  attachCookieToResponse({ res, user: token });

  res.json({ data: updatedUser, msg: '', authenticatedUser: res.locals.user });
};
//==============================================
const deleteAccount = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'pleaseProvideID');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideCorrectID');
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
    return notFoundError(res, 'ThereNoSuchUserInDatabase');
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
      'failedToDeleteAssociatedImageFromFirebaseStorage'
    );
  }

  res.json({ data: deletedUser, msg: '', authenticatedUser: res.locals.user });
};

const myVacations = async (req, res) => {
  const userId = req.user.userId;
  console.log(`Hello we are ${userId}`);
  if (!userId) {
    return badRequestError(res, 'pleaseProvideID');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return badRequestError(res, 'pleaseProvideCorrectID');
  }

  const usersVacations = await VACATION_SCHEMA.find({ senderId: userId });

  if (!usersVacations) {
    return notFoundError(res, 'YouHaveNoVacationsRequests');
  }

  console.log(usersVacations);

  res.json({
    data: usersVacations,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateVacationState = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideID');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideCorrectID');
  }

  const { vacationState } = req.body;
  if (!vacationState) {
    return notFoundError(res, 'PleaseProvideNewStateOfVacation');
  }

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'update vacation state',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  const vacation = await VACATION_SCHEMA.findOneAndUpdate(
    { _id: id },
    { vacationState: vacationState },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    data: vacation,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

//============================
//STUDENT FUNCTION
//============================

const getMyTeachers = async (req, res) => {
  // STUDENT INFO
  const studentId = req.user.userId;

  if (!studentId) {
    return badRequestError(res, 'pleaseProvideID');
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return badRequestError(res, 'pleaseProvideCorrectID');
  }

  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: studentId });
  const { className, classType } = studentInfo;
  // STUDENT TEACHER INFO
  const teacherInfo = await TEACHER_SCHEMA.find({
    teacherClasses: {
      $elemMatch: { className, classType },
    },
  }).select('name image role subject gender');

  res.json({
    data: teacherInfo,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

//============================
//TEACHER FUNCTION
//============================

const getMyStudentsGrade = async (req, res) => {
  const teacherId = req.user.userId;
  check_ID(res, teacherId);
  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });
  const { teacherClasses } = teacherInfo;

  const myStudentsGrade = await STUDENT_SCHEMA.find({
    $or: teacherClasses.map(({ className, classType }) => ({
      className,
      classType,
    })),
  });

  const studentWithTheirMarks = await Promise.all(
    myStudentsGrade.map(async (student) => {
      const studentWithGrade = await StudentMarks.find({
        username: student.username,
      });

      return {
        studentGrade: studentWithGrade,
      };
    })
  );

  res.json({
    data: studentWithTheirMarks,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

//test test

const testTokenFunction = async (req, res) => {
  try {
    const user = await TEACHER_SCHEMA.findOne({
      userNotficationTokens: { $elemMatch: { token: 'abc123xyz456' } },
    });

    if (user) {
      res.json({ user });
      console.log('User found:', user);
    } else {
      res.json({ message: 'No user found with the specified token.' });
      console.log('No user found with the specified token.');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error('Error occurred:', error);
  }
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
  myVacations,
  updateVacationState,
  getMyTeachers,
  getMyStudentsGrade,
  testTokenFunction,
};
