const Marty = require('marty');

const api = require('../modules/api');
const time = require('../modules/time');

const LocSubConstants = require('../constants/LocSubConstants');
const Location = require('../models/Location');
const UserLocationRefresh = require('../models/UserLocationRefresh');

class LocSubActions extends Marty.ActionCreators {

  // (UserLocation) -> Promise[Unit]
  update(userLocation){
    const store = this.app.locPubStore;
    return store.firstPing() ?
      this.init(userLocation) :
      this.refresh(UserLocationRefresh({
        lastPing: store.getLastPing(),
        location: userLocation
      }));
  }

  // update(userLocation){
  //   const store = this.app.locPubStore;
  //   return store.firstPing() ?
  //     this.init(userLocation) :
  //     this.refresh(UserLocationRefresh({
  //       lastPing: store.getLastPing(),
  //       location: userLocation
  //     }));
  // }

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
