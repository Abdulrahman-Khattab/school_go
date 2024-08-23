const mongoose = require('mongoose');
const Resource = require('../model/resource');
const { notFoundError, badRequestError } = require('../errors_2');
const TEACHER_SCHEMA = require('../model/user_teacher');
const STUDENT_SCHEMA = require('../model/user_students');

const createResource = async (req, res) => {
  const teacherId = req.user.userId;
  let allowedClasses = [];
  let classTypesResource = [];
  let classNameResource;
  const { className, classTypes, title, text } = req.body;

  if (!className) {
    return badRequestError(res, 'PleaseProvideClassName');
  }
  if (!classTypes) {
    return badRequestError(res, 'PleaseProvideclassTypes');
  }
  if (!title) {
    return badRequestError(res, 'PleaseProvideTitle');
  }
  if (!text) {
    return badRequestError(res, 'PleaseProvideText');
  }

  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });

  if (!teacherInfo || teacherInfo.length == 0) {
    return notFoundError(res, 'ThisTeacherAccountDoesNotExist');
  }

  teacherInfo.teacherClasses.forEach((teacherClass) => {
    if (
      teacherClass.className == className &&
      classTypes.includes(teacherClass.classType)
    ) {
      allowedClasses.push({
        className: className,
        classType: teacherClass.classType,
      });
    }

    return;
  });

  if (allowedClasses.length == 0) {
    return badRequestError(
      res,
      `TeacherCanNotAddHomeWorksForClassesThatHeDon'tTeach`
    );
  }

  allowedClasses.forEach((allowedClass) => {
    classTypesResource.push(allowedClass.classType);
    classNameResource = allowedClass.className;
  });

  const resource = await Resource.create({
    teacherId: teacherId,
    className: classNameResource,
    classTypes: classTypesResource,
    text: text,
    title: title,
  });

  if (!resource) {
    return badRequestError(
      res,
      'SomethingWrongWithCreatingNewResourcePleaseTryAgainLater'
    );
  }

  res.json({ data: resource, msg: '', authenticatedUser: res.locals.user });
};

const getMyResource = async (req, res) => {
  const studentId = req.user.userId;
  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: studentId });
  if (!studentInfo) {
    return notFoundError(res, 'ThisUserDoesNotExist');
  }
  const myResource = await Resource.find({
    className: studentInfo.className,
    classTypes: { $in: [studentInfo.classType] },
  }).select('-_id -className -classTypes -teacherId');

  if (!myResource || myResource.length == 0) {
    return notFoundError(res, 'ThisStudentDoesNotHaveExistingValidQuiz');
  }

  res.json({ data: myResource, msg: '', authenticatedUser: res.locals.user });
};

const getAllResources = async (req, res) => {
  const resources = await Resource.find({});

  if (!resources || resources.length == 0) {
    return badRequestError(res, 'ThereIsNoResourcesInDataBase');
  }

  res.json({ data: resources, msg: '', authenticatedUser: res.locals.user });
};

const deleteResource = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const deletedResource = await Resource.findOneAndDelete({ _id: id });

  if (!deletedResource) {
    return notFoundError(res, 'pleaseProvideValidId');
  }

  res.json({
    data: deletedResource,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createResource,
  getMyResource,
  getAllResources,
  deleteResource,
};
