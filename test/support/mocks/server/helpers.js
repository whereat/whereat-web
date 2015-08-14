const {  keys, isEqual, isNumber, isString } = require('lodash');

const h = {};

h.isUserLocation = (data) =>
  isEqual(keys(data), ['id', 'lat', 'lon', 'time']) &&
  isString(data.id) === true &&
  isNumber(data.lat) === true &&
  isNumber(data.lon) === true &&
  isNumber(data.time) === true;

h.isUserLocationRefresh = (data) =>
  isEqual(keys(data), ['lastPing', 'location']) &&
  isNumber(data.lastPing) &&
  h.isUserLocation(data.location);

module.exports = h;
