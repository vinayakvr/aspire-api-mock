const Loan = require("../models/loan");
const Repayment = require("../models/repayment");
const { ID_PREFIX, REPAYMENT_STATUSES, LOAN_STASUSES } = require("../utils/constants");
const { generateIds } = require("../utils/generate-ids");

const createLoan = async (req) => {
  const { amount, term } = req.body;
  const userId = req.userId;
  const loanId = generateIds(ID_PREFIX.LOAN);
  // Create loan entity
  let loan;
  try {
    loan = await Loan.create({
      id: loanId,
      amount,
      term,
      status: LOAN_STASUSES.PENDING,
      userId,
    });
  } catch(err) {
    throw new Error("error creating loan: "+err.message);
  }
  // Create repayments
  const repaymentAmount = (amount / term).toFixed(2);
  const repayments = [];
  const today = new Date();
  for (let i = 0; i < term; i++) {
    const repayment = {
      id: generateIds(ID_PREFIX.REPAYMENT),
      amount: repaymentAmount,
      status: REPAYMENT_STATUSES.PENDING,
      loanId: loan.id,
      dueAt: new Date(today.setDate(today.getDate() + (7))),
      status: REPAYMENT_STATUSES.PENDING,
    }
    repayments.push(repayment);
  }
  let repaymentsCreated = [];
  try {
    repaymentsCreated = await Repayment.bulkCreate(repayments);
  } catch(err) {
    throw new Error("error creating repayments: "+err.message);
  }
  return {
    message: "loan and repayments created",
    loan: loan,
    repayments: repaymentsCreated,
  };
}

const getLoans = async (req) => {
  const { userId } = req;
  const loans = await Loan.findAll({ where: { userId } });
  return { data: loans };
}

const approveLoan = async (loanId) => {
  const loan = await Loan.findOne({ where: { id: loanId } });
  if (!loan) {
    throw new Error("loan not found for the given id");
  }
  loan.status = LOAN_STASUSES.APPROVED;
  try {
    await loan.save();
  } catch(err) {
    throw err;
  }
  return loan;
}

const repayLoan = async (userId, loanId, amount) => {
  const loan = await Loan.findOne({ where: { id: loanId, userId } });
  if (!loan) {
    throw new Error("loan not found for the given id for this user");
  }
  // Fetch repayments which are PENDING
  const repayments = await Repayment.findAll({ where: { loanId, status: REPAYMENT_STATUSES.PENDING }, order: [['dueAt', 'ASC']] });
  if (repayments.length > 0) {
    const currRepayment = repayments[0];
    if (amount >= currRepayment.amount) {
      currRepayment.status = REPAYMENT_STATUSES.PAID;
      await currRepayment.save();
    }
    let loanPending = false;
    repayments.forEach(rp => {
      if (rp.status === REPAYMENT_STATUSES.PENDING) {
        loanPending = true;
      }
    });
    if (!loanPending) {
      loan.status = LOAN_STASUSES.PAID;
      await loan.save();
    }
    return {loan, repayments};
  }
  throw new Error('no repayments to pay for')
}

module.exports = {
  createLoan,
  getLoans,
  approveLoan,
  repayLoan,
}
