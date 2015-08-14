const { initResponse } = require('../../../support/sampleLocations');
const {  keys, isEqual, isNumber, isString } = require('lodash');

module.exports = (match, data) =>
  correctFormat(data) ? initResponse : new Error(404);

const correctFormat = (data) => (
  isEqual(keys(data), ['id', 'lat', 'lon', 'time']) &&
    isString(data.id) === true &&
    isNumber(data.lat) === true &&
    isNumber(data.lon) === true &&
    isNumber(data.time) === true );
