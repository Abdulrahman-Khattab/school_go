const createUserToken = (user) => {
  return {
    name: user.name,
    role: user.role,
    userId: user._id,
    userName: user.userName,
    image: user.image,
  };
};

module.exports = createUserToken;
