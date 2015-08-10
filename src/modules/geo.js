const { USER_LOCATION_INTERVAL } = require('../constants/Intervals');

const geo = {};

// (Navigator) -> Promise[LatLon]
geo.get = (nav = navigator) => (
  new Promise(
    (resolve, reject) => !nav.geolocation ?
      reject('Geolocation not available') :
      nav.geolocation.getCurrentPosition(p => resolve(p))));

// ((LatLon => Unit), (Error => Unit), Number) -> Number [id]
geo.poll = (publisher, err, sec = USER_LOCATION_INTERVAL) => (
  navigator.geolocation.watchPosition(
    publisher, err, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: sec * 1000 }));

// (Number) -> Unit
geo.stopPolling = (id) => navigator.geolocation.clearWatch(id);

module.exports = geo;
