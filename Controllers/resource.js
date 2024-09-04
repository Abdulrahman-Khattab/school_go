const mongoose = require('mongoose');
const Resource = require('../model/resource');
const {
  notFoundError,
  badRequestError,
  notFoundError2,
} = require('../errors_2');
const TEACHER_SCHEMA = require('../model/user_teacher');
const STUDENT_SCHEMA = require('../model/user_students');
const check_ID = require('../utility/check_ID');

const createResource = async (req, res) => {
  const teacherId = req.user.userId;
  let allowedClasses = [];
  let classTypesResource = [];
  let classNameResource;
  const { className, classTypes, title, text, subjectIcon } = req.body;

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
  if (!subjectIcon) {
    return badRequestError(res, 'PleaseProvideSubjectIcont');
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
    teacherName: teacherInfo.name,
    subjectIcon: subjectIcon,
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

const updateResource = async (req, res) => {
  let classTypesUpdate = [];
  let classNameUpdate;
  const updatedData = {};

  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'pleaseProvideValidId');
  }

  const { className, classTypes, title, text, subjectIcon } = req.body;

  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: req.user.userId });
  const resourceInfo = await Resource.findOne({ _id: id });

  if (className) {
    teacherInfo.teacherClasses.forEach((teacherClass) => {
      if (teacherClass.className == className) {
        classNameUpdate = className;
      }
      return;
    });
    updatedData.className = classNameUpdate;
  }

  if (classTypes || classTypes.length == 0) {
    teacherInfo.teacherClasses.forEach((teacherClass) => {
      if (
        classTypes.includes(teacherClass.classType) &&
        (teacherClass.className == className ||
          teacherClass.className == resourceInfo.className)
      ) {
        classTypesUpdate.push(teacherClass.classType);
      }
      return;
    });

    if (classTypesUpdate.length > 0) {
      updatedData.classTypes = classTypesUpdate;
    }
  }

  if (title) {
    updatedData.title = title;
  }
  if (text) {
    updatedData.text = text;
  }
  if (subjectIcon) {
    updatedData.subjectIcon = subjectIcon;
  }

  const updatedResource = await Resource.findOneAndUpdate(
    { _id: id },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    data: updatedResource,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const teacherResource = async (req, res) => {
  const teacherId = req.user.userId;
  check_ID(res, teacherId);
  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });
  const teacherResourceInfo = await Resource.find({ teacherId: teacherId });
  notFoundError2(res, teacherResourceInfo, 'thisTeacherHaveNoResource');
  res.json({
    data: teacherResourceInfo,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createResource,
  getMyResource,
  getAllResources,
  deleteResource,
  updateResource,
  teacherResource,
};
