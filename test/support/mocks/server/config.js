const {  keys, isEqual, isNumber, isString } = require('lodash');
const { s17UL } = require('../../../support/sampleLocations');
const { correctFormat } = require('./helpers');

module.exports = [{
  pattern: "https://whereat-server.herokuapp.com/locations/init",
  fixtures: (match, data) => correctFormat(data) ? [data] : new Error(404),
  callback: (match, data) => ({ body: data })
}, {
  pattern: "https://whereat-server.herokuapp.com/locations/refresh",
  fixtures: (match, data) => correctFormat(data) ? [s17UL, data] : new Error(404),
  callback: (match, data) => ({ body: data })
}];
