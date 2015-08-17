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
    return Promise.resolve(this.dispatch(LocSubConstants.UPDATE_STARTING, now())) // overwrites `lastPing`
      .then(() => api.update(req))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

  // (UserLocation, () => Number) -> Promise[Unit]
  init(userLocation, now = time.now){
    return Promise
      .resolve(this.dispatch(LocSubConstants.INIT_STARTING, now())) // will change lastPing!!
      .then(() => api.init(userLocation))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

  // (UserLocationRefresh, () => Number ) -> Promise[Unit]
  refresh(userLocationRefresh, now = time.now){
    return Promise
      .resolve(this.dispatch(LocSubConstants.REFRESH_STARTING, now())) // will change lastPing!!
      .then(() => api.refresh(userLocationRefresh))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

}

module.exports = LocSubActions;
