const {
  notFoundError2,
  notFoundError,
  badRequestError,
} = require('../errors_2');
const check_ID = require('../utility/check_ID');

const Attendance_Schema = require('../model/attendanceForm');
const TEACHER_SCHEMA = require('../model/user_teacher');
const STUDENT_SCHEMA = require('../model/user_students');

const createAttendanceForm = async (req, res) => {
  const { className, classType, students, lecture, subject } = req.body;
  if (!className) {
    return badRequestError(res, 'PleaseProvideClassName');
  }
  if (!classType) {
    return badRequestError(res, 'PleaseProvideClassType');
  }
  if (!students) {
    return badRequestError(res, 'PleaseProvideStudents');
  }

  if (!lecture) {
    return badRequestError(res, 'PleaseProvideLecture');
  }

  if (!subject) {
    return badRequestError(res, 'PleaseProvideSubject');
  }

  const teacherId = req.user.userId;
  check_ID(res, teacherId);

  const studentsAttendance = await Attendance_Schema.create({
    className: className,
    classType: classType,
    students: students,
    teacherId: teacherId,
    lecture: lecture,
    subject: subject,
  });

  res.json({
    data: studentsAttendance,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getStudentsForTeacher = async (req, res) => {
  const { className, classType } = req.body;
  console.log(className);
  console.log(classType);
  if (!className) {
    badRequestError(res, 'PleaseProvideClassName');
  }
  if (!classType) {
    badRequestError(res, 'PleaseProvideClassType');
  }
  const teacherId = req.user.userId;
  check_ID(res, teacherId);

  const teacherInfo = await TEACHER_SCHEMA.findOne({
    _id: teacherId,

    teacherClasses: {
      $elemMatch: {
        className: className.toLowerCase(), // Make sure to match the lowercase version as per your schema
        classType: classType.toLowerCase(),
      },
    },
  });

  if (!teacherInfo) {
    return badRequestError(res, 'YouAreNotTeachingThisClass');
  }

  const studentsInfo = await STUDENT_SCHEMA.find({
    className: className,
    classType: classType,
  });

  res.json({
    data: studentsInfo,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getTeacherSubjectAttendance = async (req, res) => {
  const teacherId = req.user.userId;
  check_ID(res, teacherId);

  const teacherInfo = await TEACHER_SCHEMA.findOne({ _id: teacherId });

  const { subject } = teacherInfo;

  console.log(subject);
  console.log(teacherId);

  const myStudentsAttendance = await Attendance_Schema.find({
    subject: subject,
    teacherId: teacherId,
  });

  res.json({
    data: myStudentsAttendance,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getAllStudentsOfSpeceficClass = async (req, res) => {
  const { className, classType } = req.body;
  console.log(className);
  console.log(classType);
  if (!className) {
    badRequestError(res, 'PleaseProvideClassName');
  }
  if (!classType) {
    badRequestError(res, 'PleaseProvideClassType');
  }

  const studentsInfo = await Attendance_Schema.find({
    className: className,
    classType: classType,
  });

  res.json({
    data: studentsInfo,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteAttendnceForm = async (req, res) => {
  const { id } = req.params;
  check_ID(res, id);

  const deletedAttendnceForm = await Attendance_Schema.findOneAndDelete({
    _id: id,
  });

  res.json({
    data: deletedAttendnceForm,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateAttendnceForm = async (req, res) => {
  const { id } = req.params;
  check_ID(res, id);

  const { className, classType, students, lecture, subject } = req.body;
  const updateData = {};
  if (className) {
    updateData.className = className;
  }
  if (classType) {
    updateData.classType = classType;
  }
  if (students || students.length > 0) {
    updateData.students = students;
  }

  if (lecture) {
    updateData.lecture = lecture;
  }

  if (subject) {
    updateData.subject = subject;
  }

  const teacherId = req.user.userId;
  check_ID(res, teacherId);

  const updatedStudentsAttendance = await Attendance_Schema.findOneAndUpdate(
    {
      _id: id,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    data: updatedStudentsAttendance,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createAttendanceForm,
  getStudentsForTeacher,
  getTeacherSubjectAttendance,
  getAllStudentsOfSpeceficClass,
  deleteAttendnceForm,
  updateAttendnceForm,
};
