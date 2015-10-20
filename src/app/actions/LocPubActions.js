const Marty = require('marty');

const { wait } = require('../modules/async');
const geo = require('../modules/geo');

const NotificationConstants = require('../constants/NotificationConstants');
const LocPubConstants = require('../constants/LocPubConstants');
const LocSubConstants = require('../constants/LocSubConstants');
const GoButtonConstants = require('../constants/GoButtonConstants');
const { FLASH_INTERVAL, NOTIFICATION_INTERVAL, USER_LOCATION_INTERVAL } = require('../constants/Intervals');
const Location = require('../models/Location');
const UserLocation = require('../models/UserLocation');
const { partial } = require('lodash');
const sc = require('../modules/scheduler');

class LocPubActions extends Marty.ActionCreators {

  // (NavigatorPosition, UserLocation => Unit, Number) -> Promise[Unit]
  publish(pos, ni = NOTIFICATION_INTERVAL){
    const userLoc = this._parseUserLoc(pos);
    return Promise
      .resolve(this.dispatch(LocPubConstants.USER_LOCATION_ACQUIRED, userLoc))
      .then(() => this.app.notificationActions.notify('Location shared.', ni))
      .then(() => this.app.locSubActions.update(userLoc));
  }

  // (NavigatorPosition) -> Location
  _parseUserLoc(pos){
    return UserLocation({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      time: pos.timestamp || new Date().getTime()
    });
  }

  // (Geo, Number, Number) -> Promise[Unit]
  ping(g = geo, pi = FLASH_INTERVAL, ni = NOTIFICATION_INTERVAL){
    return g.get()
      .catch(err => Promise.reject(this.app.notificationActions.notify(err)))
      .then(pos => this.publish(pos, ni));
  }

  // (Number, Number) -> Promise[Unit]
  poll(pi = USER_LOCATION_INTERVAL, ni = NOTIFICATION_INTERVAL){
    const id = sc.schedule(this.app.locPubActions.ping.bind(this), pi);
    this.dispatch(GoButtonConstants.GO_BUTTON_ON);
    this.dispatch(LocPubConstants.POLLING_ON, id);
    return Promise.resolve(
      this.app.notificationActions.notify('Location sharing on.', ni));
  }

  // (Number, Number) -> Promise[Unit]
  stopPolling(id, ni = NOTIFICATION_INTERVAL){
    sc.cancel(id);
    this.dispatch(GoButtonConstants.GO_BUTTON_OFF);
    this.dispatch(LocPubConstants.POLLING_OFF);
    return Promise.resolve(
      this.app.notificationActions.notify('Location sharing off.', ni));
  }
}

module.exports = LocPubActions;
