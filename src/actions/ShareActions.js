const Marty = require('marty');
const ShareConstants = require('../constants/ShareConstants');
const ToastConstants = require('../constants/ToastConstants');
const { PING, POLL } = require('../constants/ToastTypes');
const { wait } = require('../modules/async');

const pingInterval = .1;
const toastInterval = 2;

class ShareActions extends Marty.ActionCreators {

  ping(pInt = pingInterval, tInt = toastInterval){
    return Promise.all([this._dispatchPing(pInt), this._dispatchToast(PING, tInt)]);
  }

  togglePoll(interval = toastInterval){
    return Promise.all([this._dispatchPoll(), this._dispatchToast(POLL, interval)]);
  }

  _dispatchPing(interval){
    return Promise.resolve(this.dispatch(ShareConstants.PING_STARTING))
      .then(() => wait(interval))
      .then(() => this.dispatch(ShareConstants.PING_DONE));
  }

  _dispatchPoll(){
    return Promise.resolve(this.dispatch(ShareConstants.POLL_TOGGLED));
  }

  // (ToastType) -> Promise[Unit]
  _dispatchToast(type, interval){
    return Promise.resolve(this.dispatch(ToastConstants.TOAST_STARTING, type))
      .then(() => wait(interval))
      .then(() => this.dispatch(ToastConstants.TOAST_DONE));
  }
}

module.exports = ShareActions;
