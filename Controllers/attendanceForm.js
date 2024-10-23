const {
  notFoundError2,
  notFoundError,
  badRequestError,
} = require('../errors_2');
const check_ID = require('../utility/check_ID');
const create_notification = require('../utility/create_notification');

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

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
      'dl-V0oHmRnqQaPMfh3B-hb:APA91bHsBi0MLcWWaiqdRq7k0mE7Bg0IvaxtCEsTT5fLyzy_e5TQC6hHDI39IdACUA-K_8S7VCGCN2CcmYDSckj8ax_1CzCwdnLaf-ZYxoWA8xa6I0K7tvbfwZMbqZhjybpCuhyA6xGF',
    ],
    'create_attendance_form',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

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

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
      '',
    ],
    'update_Attendance_form',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.json({
    data: updatedStudentsAttendance,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const getMyAttendanceAsStudent = async (req, res) => {
  const { username } = req.user;

  const myAttendance = await Attendance_Schema.aggregate([
    {
      $match: {
        'students.studentUserName': username,
      },
    },
    {
      $project: {
        students: {
          $filter: {
            input: '$students',
            as: 'student',
            cond: { $eq: ['$$student.studentUserName', username] },
          },
        },
        className: 1,
        classType: 1,
        subject: 1,
        lecture: 1,
        timestamps: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (myAttendance.length === 0) {
    return notFoundError(res, 'noUserAttendanceAdded');
  }

  res.json({
    data: myAttendance,
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
  getMyAttendanceAsStudent,
};
