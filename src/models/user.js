const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database/sequelize');
const { USER_ROLES_LIST, USER_ROLES } = require('../utils/constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  role: {
    type: DataTypes.ENUM(USER_ROLES_LIST),
    allowNull: false,
    defaultValue: USER_ROLES.CUSTOMER,
  },
}, {});

module.exports = User;
