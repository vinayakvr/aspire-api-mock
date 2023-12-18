const error = require("../utils/error");

const signupValidator = (req, res, next) => {
  res = res.status(400);
  const { username, password } = req.body;
  if(!username) {
    return res.send(error("username is required"));
  }
  if(!password) {
    return res.send(error("password is required"));
  }
  next();
}

module.exports = {
  signupValidator,
};
