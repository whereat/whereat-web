const Marty = require('marty');

const { wait } = require('../modules/async');
const geo = require('../modules/geo');

const NotificationConstants = require('../constants/NotificationConstants');
const UserLocationConstants = require('../constants/UserLocationConstants');
const GoButtonConstants = require('../constants/GoButtonConstants');
const { FLASH_INTERVAL, NOTIFICATION_INTERVAL } = require('../constants/Intervals');

class UserLocationActions extends Marty.ActionCreators {

  // (NavigatorPosition) -> Promise[Unit]
  publish(pos, ni = NOTIFICATION_INTERVAL){
    const loc = UserLocationActions._parseLoc(pos);
    debugger;
    return Promise
      .resolve(this.dispatch(UserLocationConstants.USER_LOCATION_ACQUIRED, loc))
      .then(() => this.app.notificationActions.notify(
        `Location shared: ${JSON.stringify(loc, null, 2)}`, ni));
  }

  // (NavigatorPosition) -> Location
  _parseLoc(pos){
    return {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      time: pos.time || new Date()
    };
  }

  // (Geo, Number, Number) -> Promise[Unit]
  ping(g = geo, pi = FLASH_INTERVAL, ni = NOTIFICATION_INTERVAL){
    return Promise.all([
      this._flash(pi),
      g.get().then(loc => this.publish(loc, ni))
    ]);
  }

  // (Number) -> Promise[Unit]
  _flash(interval){
    return Promise.resolve(this.dispatch(GoButtonConstants.GO_BUTTON_ON))
      .then(() => wait(interval))
      .then(() => Promise.resolve(this.dispatch(GoButtonConstants.GO_BUTTON_OFF)));
  }

  // (Geo, Number) -> Promise[Unit]
  poll(g = geo, ti = NOTIFICATION_INTERVAL){
    const id = g.poll(this.publish, this.toast);
    this.dispatch(GoButtonConstants.GO_BUTTON_ON);
    this.dispatch(UserLocationConstants.POLLING_ON, id);
    return this.app.notificationActions.notify('Location sharing on.', ti);
  }

  // (Number, Geo, Number) -> Promise[Unit]
  stopPolling(id, g = geo, ni = NOTIFICATION_INTERVAL ){
    g.stopPolling(id);
    this.dispatch(GoButtonConstants.GO_BUTTON_OFF);
    this.dispatch(UserLocationConstants.POLLING_OFF);
    return this.app.notificationActions.notify('Location sharing off.', ni);
  }
}

module.exports = UserLocationActions;
