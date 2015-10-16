const { USER_LOCATION_INTERVAL } = require('../constants/Intervals');

const geo = {};

//(Navigator) -> Promise[LatLon]
geo.get = (nav = navigator) => (
  new Promise((resolve, reject) => (
    !nav.geolocation ?
      reject('Phone not providing location.') :
      nav.geolocation.getCurrentPosition(p => resolve(p)))));

module.exports = geo;
