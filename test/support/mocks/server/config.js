const {  keys, isEqual, isNumber, isString } = require('lodash');
const { s17UL } = require('../../../support/sampleLocations');
const { isUserLocation, isUserLocationRefresh } = require('./helpers');
const UserLocation = require('../../../../src/models/UserLocation');
const cb = (match, data) => ({ body: data });

module.exports = [{
  pattern: "https//whereat-server.herokuapp.com/locations/update",
  fixtures: (match, data) => isUserLocationRefresh(data) ?
    [s17UL, UserLocation(data.location.toJS())] :
    new Error('Bad Request'),
  callback: cb
}, {
  pattern: "https://whereat-server.herokuapp.com/locations/init",
  fixtures: (match, data) => isUserLocation(data) ? [data] : new Error('Bad Request'),
  callback: cb
}, {
  pattern: "https://whereat-server.herokuapp.com/locations/refresh",
  fixtures: (match, data) => isUserLocationRefresh(data) ?
    [s17UL, UserLocation(data.location).toJS()] :
    new Error('Bad Request'),
  callback: cb
}];
