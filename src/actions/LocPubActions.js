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
    const loc = this._parseLoc(pos);
    const lastPing = this.app.locPubStore.getLastPing();
    const sub = this._getLocSubAction();
    console.log('LAST PING:', lastPing);
    console.log('SUB:', sub);
    return Promise
      .resolve(this.dispatch(LocPubConstants.USER_LOCATION_ACQUIRED, loc))
      .then(() => this.app.notificationActions.notify('Location shared.', ni))
      .then(() => sub(UserLocation(loc)));
  }

  // (NavigatorPosition) -> Location
  _parseLoc(pos){
    return Location({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      time: pos.timestamp || new Date().getTime()
    });
  }

  // () -> UserLocation => Unit
  _getLocSubAction(){
    return this.app.locPubStore.firstPing() ?
      this.app.locSubActions.init.bind(this.app.locSubActions) :
      this.app.locSubActions.refresh.bind(this.app.locSubActions);
  }

  // (Geo, Number, Number) -> Promise[Unit]
  ping(g = geo, pi = FLASH_INTERVAL, ni = NOTIFICATION_INTERVAL){
    return Promise.all([
      g.get().then(pos => this.publish(pos, ni)),
      this._flash(pi)
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
    const id = g.poll(
      this.app.locPubActions.publish.bind(this),
      this.app.notificationActions.notify);

    this.dispatch(GoButtonConstants.GO_BUTTON_ON);
    this.dispatch(LocPubConstants.POLLING_ON, id);
    return this.app.notificationActions.notify('Location sharing on.', ti);
  }

  // (Number, Geo, Number) -> Promise[Unit]
  stopPolling(id, g = geo, ni = NOTIFICATION_INTERVAL ){
    g.stopPolling(id);
    this.dispatch(GoButtonConstants.GO_BUTTON_OFF);
    this.dispatch(LocPubConstants.POLLING_OFF);
    return this.app.notificationActions.notify('Location sharing off.', ni);
  }
}

module.exports = LocPubActions;
