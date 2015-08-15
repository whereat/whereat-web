const Marty = require('marty');

const api = require('../modules/api');

const LocSubConstants = require('../constants/LocSubConstants');
const Location = require('../models/Location');

class LocSubActions extends Marty.ActionCreators {

  // (UserLocation) -> Promise[Unit]
  init(userLocation){
    return Promise
      .resolve(this.dispatch(LocSubConstants.LOC_SUB_INIT_STARTING))
      .then(() => api.init(userLocation))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

  // (UserLocationRefresh -> Promise[Unit]
  refresh(userLocationRefresh){
    return Promise
      .resolve(this.dispatch(LocSubConstants.LOC_SUB_REFRESH_STARTING))
      .then(() => api.refresh(userLocationRefresh))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

}

module.exports = LocSubActions;
