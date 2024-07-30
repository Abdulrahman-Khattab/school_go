const createUserToken = (user) => {
  if (!user.className) {
    user.className = '';
  }

  if (!user.classType) {
    user.classType = '';
  }

  if (!user.student_parents) {
    user.student_parents = '';
  }

  if (!user.teacherClasses) {
    user.teacherClasses = '';
  }

  if (!user.email) {
    user.email = '';
  }
  return {
    name: user.name,
    role: user.role,
    userId: user._id,
    userName: user.userName,
    image: user.image,
    className: user.className,
    classType: user.classType,
    student_parents: user.student_parents,
    teacherClasses: user.teacherClasses,
  };
};

module.exports = createUserToken;
