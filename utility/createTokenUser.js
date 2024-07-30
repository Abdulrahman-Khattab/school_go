const createUserToken = (user) => {
  return {
    name: user.name,
    role: user.role,
    userId: user._id,
    userName: user.userName,
  };
};

module.exports = createUserToken;
