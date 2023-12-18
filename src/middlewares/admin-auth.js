const { fetchUserById } = require("../user/user");
const { X_USER_ID, USER_ROLES } = require("../utils/constants");
const error = require("../utils/error");

const adminAuth = async (req, res, next) => {
  const headers = req.headers;
  const userId = headers[X_USER_ID];
  if (!userId) {
    return res.status(401).send(error("Unauthorized. x-user-id expected in request header"));
  }
  req.userId = userId;
  try {
    const user = await fetchUserById(userId);
    if (user.role !== USER_ROLES.ADMIN) {
      return res.status(401).send(error("Unauthorized. User is not an admin"));
    }
  } catch(err) {
    return res.status(404).send(error(err.message || 'internal server error'));
  }
  next();
}

module.exports = {
  adminAuth,
};
