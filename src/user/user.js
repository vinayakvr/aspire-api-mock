const User = require("../models/user");
const { ID_PREFIX } = require("../utils/constants");
const { generateIds } = require("../utils/generate-ids");
const { hashPassword } = require("../utils/hash-password");
const bcrypt = require('bcrypt');

const signup = async (req) => {
  const { username, name, password, role } = req.body;
  // Check if user exists with the same username
  const userExists = await User.findOne({ where: { username } });
  if (userExists) {
    throw new Error("user already exists");
  }
  const passwordHash = await hashPassword(password);
  const userId = generateIds(ID_PREFIX.USER);
  const user = await User.create({
    id: userId,
    username,
    name,
    password: passwordHash,
    role: role,
  });
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

const signin = async(req) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error("user does not exist");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("invalid password");
  }
  return {
    token: user.id
  };
}

const fetchUserById = async(userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("user does not exist");
  }
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

module.exports = {
  signup,
  signin,
  fetchUserById,
}
