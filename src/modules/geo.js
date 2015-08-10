const { USER_LOCATION_INTERVAL } = require('../constants/Intervals');

const geo = {};

// (Navigator) -> Promise[LatLon]
geo.get = (nav = navigator) => (
  nav.geolocation ?
    Promise.resolve(nav.geolocation.getCurrentPosition()) :
    Promise.reject('Geolocation not available'));

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
