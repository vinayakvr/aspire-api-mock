const moment = require('moment');
const uuid = require('uuid');

function generateIds(prefix) {
  const timestamp = moment().format('YYYYMMDD');
  const randomSuffix = uuid.v4().substring(0, 6);
  return `${prefix}${timestamp}${randomSuffix}`;
}

module.exports = {
  generateIds,
}
