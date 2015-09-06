const { Record } = require('immutable');
const UserLocation = require('./UserLocation');
const { USER_ID } = require('../constants/Keys');

const UserLocationRefresh = Record({
  lastPing: 0,
  location: UserLocation()
});

module.exports = UserLocationRefresh;
