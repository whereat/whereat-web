const {  keys, isEqual, isNumber, isString } = require('lodash');
const { s17UL } = require('../../../support/sampleLocations');
const { isUserLocation, isUserLocationRefresh, isUser } = require('./helpers');
const UserLocation = require('../../../../app/models/UserLocation');
const cb = (match, data) => ({ body: data });

module.exports = [{
  pattern: "https://api.whereat.io/locations/update",
  fixtures: (match, data) => isUserLocationRefresh(data) ?
    [s17UL, UserLocation(data.location).toJS()] :
    new Error('Bad Request'),
  callback: cb
}, {
  pattern: "https://api.whereat.io/locations/remove",
  fixtures: (match, data) => isUser(data) ?
    '1 record(s) deleted.' :
    new Error('Bad Request'),
  callback: cb
}, {
  pattern: "https://api.whereat.io/locations/refresh",
  fixtures: (match, data) => isUserLocationRefresh(data) ?
    [s17UL, UserLocation(data.location).toJS()] :
    new Error('Bad Request'),
  callback: cb
}];
