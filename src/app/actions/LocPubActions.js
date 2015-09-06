const Marty = require('marty');

const { wait } = require('../modules/async');
const geo = require('../modules/geo');

const NotificationConstants = require('../constants/NotificationConstants');
const LocPubConstants = require('../constants/LocPubConstants');
const LocSubConstants = require('../constants/LocSubConstants');
const GoButtonConstants = require('../constants/GoButtonConstants');
const { FLASH_INTERVAL, NOTIFICATION_INTERVAL } = require('../constants/Intervals');
const Location = require('../models/Location');
const UserLocation = require('../models/UserLocation');
const { partial } = require('lodash');

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
    return Promise.all([
      g.get()
        .catch(err => Promise.reject(this.app.notificationActions.notify(err)))
        .then(pos => this.publish(pos, ni))
        .then(() => this.app.notificationActions.notify('Press and hold to keep on.')),
      this._flash(pi)
    ]);
  }

  // (Number) -> Promise[Unit]
  _flash(interval){
    return Promise.resolve(this.dispatch(GoButtonConstants.GO_BUTTON_ON))
      .then(() => wait(interval))
      .then(() => Promise.resolve(
        this.dispatch(GoButtonConstants.GO_BUTTON_OFF)));
  }

  // (Geo, Number) -> Promise[Unit]
  poll(g = geo, ni = NOTIFICATION_INTERVAL){
    const id = g.poll(
      this.app.locPubActions.publish.bind(this),
      () => this.app.notificationActions.notify('Phone not providing location.')
    );
    return Promise
      .resolve(this.dispatch(GoButtonConstants.GO_BUTTON_ON))
      .then(() => Promise.resolve(this.dispatch(LocPubConstants.POLLING_ON, id)))
      .then(() => this.app.notificationActions.notify('Location sharing on.', ni));
  }

  // (Number, Geo, Number) -> Promise[Unit]
  stopPolling(id, g = geo, ni = NOTIFICATION_INTERVAL ){
    g.stopPolling(id);
    return Promise
      .resolve(this.dispatch(GoButtonConstants.GO_BUTTON_OFF))
      .then(() => Promise.resolve(this.dispatch(LocPubConstants.POLLING_OFF)))
      .then(() => this.app.notificationActions.notify('Location sharing off.', ni));
  }

}

module.exports = LocPubActions;
