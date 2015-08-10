const { Record } = require('immutable');

const UserLocation = Record({ uid: '', lat: -1, lon: -1, time: -1 });

module.exports = UserLocation;
