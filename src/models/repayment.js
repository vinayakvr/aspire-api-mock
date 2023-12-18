const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database/sequelize');
const Loan = require('./loan');
const { REPAYMENT_STASUSES_LIST, REPAYMENT_STATUSES } = require('../utils/constants');

const Repayment = sequelize.define('Repayment', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  status: {
    type: DataTypes.ENUM(REPAYMENT_STASUSES_LIST),
    allowNull: false,
    defaultValue: REPAYMENT_STATUSES.PENDING,
  },
  loanId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    references: {
      model: Loan,
      key: 'id',
    }
  },
  dueAt: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {});

module.exports = Repayment;
