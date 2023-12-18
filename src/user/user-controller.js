const error = require("../utils/error");
const { signup, signin } = require("./user")

const signupController = async(req, res) => {
  try {
    const user = await signup(req);
    return res.send(user);
  } catch(err) {
    return res.status(500).send(error(err.message || 'internal server error'));
  }
}

const signinController = async(req, res) => {
  try {
    const user = await signin(req);
    return res.send(user);
  } catch(err) {
    return res.status(500).send(error(err.message || 'internal server error'));
  }
}

module.exports = {
  signup: signupController,
  signin: signinController,
}
