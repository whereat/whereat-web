const { Record } = require('immutable');
const { USER_ID } = require('../constants/Keys');

const User = Record({ id: USER_ID });

module.exports = User;
