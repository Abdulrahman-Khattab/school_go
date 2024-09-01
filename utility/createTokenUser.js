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

  if (!user.phoneNumber || user.phoneNumber == 0 || user.phoneNumber == null) {
    user.phoneNumber = '';
  }

  if (!user.age) {
    user.age = '';
  }

  if (!user.vacations) {
    user.vacations = '';
  }

  if (!user.gender) {
    user.gender = '';
  }

  return {
    name: user.name,
    role: user.role,
    userId: user._id,
    username: user.username,
    image: user.image,
    className: user.className,
    classType: user.classType,
    student_parents: user.student_parents,
    teacherClasses: user.teacherClasses,
    email: user.email,
    phoneNumber: user.phoneNumber,
    age: user.age,
    vactions: user.vacations,
    gender: user.gender,
  };
};

module.exports = createUserToken;
