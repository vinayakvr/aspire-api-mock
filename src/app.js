const express = require("express");
require('dotenv').config();

const loanRoutes = require("./routes/loans");
const userRoutes = require("./routes/users");
const { authenticateSequelize } = require("./config/database/sequelize");
const Loan = require("./models/loan");
const User = require("./models/user");
const Repayment = require("./models/repayment");

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send({"message": "hello world"});
});

app.use('/loans', loanRoutes);
app.use('/auth', userRoutes);

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`🚀 app listening on port ${port}`);

authenticateSequelize();
const syncTables = async() => {
  try {
    await Loan.sync();
    await User.sync();
    await Repayment.sync();
    console.log('tables created successfully');
  } catch(err) {
    console.log('error during table initialisation', err);
  }
};
syncTables();



// POST /loans amount, term
// PATCH /loans/loanId/approve loanId
// GET /loans
// GET /loans/:loanId
// POST /repayments/loanId
