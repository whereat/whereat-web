const Marty = require('marty');
const ShareConstants = require('../constants/ShareConstants');
const NotificationConstants = require('../constants/NotificationConstants');
const LocationConstants = require('../constants/LocationConstants');
const GoButtonConstants = require('../constants/GoButtonConstants');
const { PING_INTERVAL, NOTIFICATION_INTERVAL } = require('../constants/Intervals');
const { wait } = require('../modules/async');
const geo = require('../modules/geo');

class ShareActions extends Marty.ActionCreators {

  // (UserLocation) -> Promise[Unit]
  publish(loc){
    return new Promise((resolve) => {
      this.dispatch(LocationConstants.USER_LOCATION_ACQUIRED, loc);
      resolve(loc);
    });
  }

  // (Geo, Number, Number) -> Promise[Unit]
  ping(g = geo, pi = PING_INTERVAL, ni = NOTIFICATION_INTERVAL){
    return Promise.all([
      Promise.resolve(this.dispatch(GoButtonConstants.GO_BUTTON_ON))
        .then(() => wait(pi))
        .then(() => Promise.resolve(this.dispatch(GoButtonConstants.GO_BUTTON_OFF))),
      g.get()
        .then(loc => this.publish(loc))
        .then(loc => Promise.all([
          wait(pi).then(() => Promise.resolve()),
          this.app.notificationActions.notify(
            `Location shared: ${JSON.stringify(loc, null, 2)}`, ni)
        ]))
    ]);
  }

  // (Geo, Number) -> Promise[Unit]
  poll(g = geo, ti = NOTIFICATION_INTERVAL){
    const id = g.poll(this.publish, this.toast);
    this.dispatch(GoButtonConstants.GO_BUTTON_ON);
    this.dispatch(ShareConstants.POLLING_ON, id);
    return this.app.notificationActions.notify('Location sharing on.', ti);
  }

  //(Number, Geo, Number) -> Promise[Unit]
  stopPolling(id, g = geo, ni = NOTIFICATION_INTERVAL ){
    g.stopPolling(id);
    this.dispatch(GoButtonConstants.GO_BUTTON_OFF);
    this.dispatch(ShareConstants.POLLING_OFF);
    return this.app.notificationActions.notify('Location sharing off.', ni);
  }
}

module.exports = ShareActions;
