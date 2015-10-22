import {  keys, isEqual, isNumber, isString } from 'lodash';
import { s17UL } from '../../../support/sampleLocations';
import { isUserLocation, isUserLocationRefresh, isUser } from './helpers';
import UserLocation from '../../../../app/models/UserLocation';
const cb = (match, data) => ({ body: data });

module.exports = [{
  pattern: "https://whereat-server.herokuapp.com/locations/update",
  fixtures: (match, data) => isUserLocationRefresh(data) ?
    [s17UL, UserLocation(data.location).toJS()] :
    new Error('Bad Request'),
  callback: cb
}, {
  pattern: "https://whereat-server.herokuapp.com/locations/remove",
  fixtures: (match, data) => isUser(data) ?
    '1 record(s) deleted.' :
    new Error('Bad Request'),
  callback: cb
}, {
  pattern: "https://whereat-server.herokuapp.com/locations/refresh",
  fixtures: (match, data) => isUserLocationRefresh(data) ?
    [s17UL, UserLocation(data.location).toJS()] :
    new Error('Bad Request'),
  callback: cb
}];
