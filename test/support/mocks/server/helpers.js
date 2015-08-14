const {  keys, isEqual, isNumber, isString } = require('lodash');

const h = {};

h.correctFormat = (data) => (
  isEqual(keys(data), ['id', 'lat', 'lon', 'time']) &&
    isString(data.id) === true &&
    isNumber(data.lat) === true &&
    isNumber(data.lon) === true &&
    isNumber(data.time) === true);

module.exports = h;
