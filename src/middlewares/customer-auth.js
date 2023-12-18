const { X_USER_ID } = require("../utils/constants");
const error = require("../utils/error");

const customerAuth = (req, res, next) => {
  res = res.status(401);
  const headers = req.headers;
  const userId = headers[X_USER_ID];
  if (!userId) {
    return res.send(error("Unauthorized. x-user-id expected in request header"))
  }
  req.userId = userId;
  next();
}

module.exports = {
  customerAuth,
};
