const Marty = require('marty');

const api = require('../modules/api');
const time = require('../modules/time');

const LocSubConstants = require('../constants/LocSubConstants');
const Location = require('../models/Location');
const UserLocation = require('../models/UserLocation');
const UserLocationRefresh = require('../models/UserLocationRefresh');

class LocSubActions extends Marty.ActionCreators {

  // (UserLocation, () => Number) -> Promise[Unit]
  update(userLocation, now = time.now){
    const req = UserLocationRefresh({
      lastPing: this.app.locPubStore.getLastPing(),
      location: UserLocation(userLocation)
    });
    return Promise
      .resolve(this.dispatch(LocSubConstants.UPDATE_STARTING, now())) // overwrites `lastPing`
      .then(() => api.update(req))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

  // (User, () => Number)  -> Promise[Unit]
  remove(user, now = time.now){
    return Promise
      .resolve(this.dispatch(LocSubConstants.REMOVE_STARTING, now())) // overwrites `lastPing`
      .then(() => api.remove(user))
      .then(() => this.dispatch(LocSubConstants.USER_REMOVED))
      .then(() => this.app.notificationActions.notify('User data removed from server.'));
  }

  // (Number) => Unit
  clear(now = time.now){
    return Promise
      .resolve(this.dispatch(LocSubConstants.LOCATION_STORE_CLEARED, now()))
      .then(() => this.app.notificationActions.notify('Erasing all pins older than 1 hour.'));
  }
}

module.exports = LocSubActions;
