const error = require("../utils/error");

const createLoanValidator = (req, res, next) => {
  const body = req.body;
  res = res.status(400);
  const amount = Number(body.amount);
  const term = Number(body.term);
  if(!body.amount) {
    return res.send(error("amount is required"));
  }
  if (isNaN(Number(amount))) {
    return res.send(error("amount should be an integer"));
  }
  if (amount === 0) {
    return res.send(error("amount cannot be zero"));
  }
  if(!body.term) {
    return res.send(error("term is required"));
  }
  if (isNaN(Number(term))) {
    return res.send(error("term should be an integer"));
  }
  if (term === 0) {
    return res.send(error("term cannot be zero"));
  }
  body.amount = amount;
  body.term = term;
  req.body = body;
  next();
}

const getLoansValidator = (req, res, next) => {
  next();
}

module.exports = {
  createLoanValidator,
  getLoansValidator,
};
