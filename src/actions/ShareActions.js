const Marty = require('marty');
const ShareConstants = require('../constants/ShareConstants');
const ToastConstants = require('../constants/ToastConstants');
const LocationConstants = require('../constants/LocationConstants');
const { PING, POLL } = require('../constants/ToastTypes');
const { PING_INTERVAL, TOAST_INTERVAL } = require('../constants/Intervals');
const { wait, waitAndPass } = require('../modules/async');
const geo = require('../modules/geo');

class ShareActions extends Marty.ActionCreators {

  ping(pInt = PING_INTERVAL, tInt = TOAST_INTERVAL){
    this.dispatch(ShareConstants.PING_STARTING);
    return geo.get()
    .then(loc => this.publish(loc))
    .then(loc => Promise.all([ // ie: in parallel
      wait(PING_INTERVAL).then(() => this.dispatch(ShareConstants.PING_DONE)),
      this.toast(`Location shared: ${loc}`, TOAST_INTERVAL)
    ]));
  }

  poll(){
    const id = geo.poll(this.publish, this.toast);
    this.dispatch(ShareConstants.POLLING_ON, id);
  }

  stopPolling(id){
    geo.stopPolling(id);
    this.dispatch(ShareConstants.POLLING_OFF);
  }

  publish(loc){
    return new Promise((resolve) => {
      this.dispatch(LocationConstants.USER_LOCATION_ACQUIRED, loc);
      resolve(loc);
    });
  }

  // (String) -> Promise[Unit]
  toast(msg, interval){
    return Promise.resolve(this.dispatch(ToastConstants.TOAST_STARTING, msg))
      .then(() => wait(interval))
      .then(() => this.dispatch(ToastConstants.TOAST_DONE));
  }
}

module.exports = ShareActions;
