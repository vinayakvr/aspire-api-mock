const express = require("express");
const router = express.Router();
const { createLoan, getLoans, approveLoan, repayLoan } = require("../loan/loan-controller");
const { createLoanValidator, getLoansValidator } = require("../middlewares/loan-validator");
const { customerAuth } = require("../middlewares/customer-auth");
const { adminAuth } = require("../middlewares/admin-auth");
const { repaymentValidator } = require("../middlewares/repayment-validator");

router.get("/", customerAuth, getLoansValidator, async(req, res) => {
  res.send(await getLoans(req));
});

router.post("/", customerAuth, createLoanValidator, async(req, res) => {
  res.send(await createLoan(req));
});

router.post("/:loanId/approve", adminAuth, approveLoan);
router.patch("/:loanId/repayment", customerAuth, repaymentValidator, repayLoan);

module.exports = router;
