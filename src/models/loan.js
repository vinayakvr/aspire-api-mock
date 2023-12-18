const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database/sequelize');
const User = require('./user');
const { LOAN_STASUSES_LIST, LOAN_STASUSES } = require('../utils/constants');

const Loan = sequelize.define('Loan', {
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
  term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
  },
  status: {
    type: DataTypes.ENUM(LOAN_STASUSES_LIST),
    allowNull: false,
    defaultValue: LOAN_STASUSES.PENDING,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    references: {
      model: User,
      key: 'id',
    }
  }
}, {});

module.exports = Loan;
