const { Record } = require('immutable');
const { USER_ID } = require('../constants/Keys');

const UserLocation = Record({ id: USER_ID, lat: -1, lon: -1, time: -1 });

module.exports = UserLocation;
