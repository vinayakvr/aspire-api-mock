const error = require("../utils/error");
const { createLoan, getLoans, approveLoan, repayLoan } = require("./loan");

const createLoanController = async(req) => {
  return await createLoan(req);
}

const getLoansController = async (req) => {
  return await getLoans(req);
}

const approveLoanController = async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const loanUpdated = await approveLoan(loanId);
    return res.send(loanUpdated);
  } catch(err) {
    return res.status(500).send(error(err.message || 'internal server error'));
  }
}

const repayLoanController = async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const userId = req.userId;
    const amount = req.body.amount;
    const repayments = await repayLoan(userId, loanId, amount);
    return res.send(repayments);
  } catch(err) {
    return res.status(500).send(error(err.message || 'internal server error'));
  }
}

module.exports = {
  createLoan: createLoanController,
  getLoans: getLoansController,
  approveLoan: approveLoanController,
  repayLoan: repayLoanController,
}
