const error = require("../utils/error");

const repaymentValidator = (req, res, next) => {
  const body = req.body;
  res = res.status(400);
  const amount = Number(body.amount);
  if(!body.amount) {
    return res.send(error("amount is required"));
  }
  if (isNaN(Number(amount))) {
    return res.send(error("amount should be an integer"));
  }
  if (amount === 0) {
    return res.send(error("amount cannot be zero"));
  }
  body.amount = amount;
  req.body = body;
  next();
}

module.exports = {
  repaymentValidator,
};
