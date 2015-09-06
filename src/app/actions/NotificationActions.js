const Marty = require('marty');
const NotificationConstants = require('../constants/NotificationConstants');
const { NOTIFICATION_INTERVAL } = require('../constants/Intervals');
const { wait } = require('../modules/async');

class NotificationActions extends Marty.ActionCreators {

  // (String) -> Promise[Unit]
  notify(msg, interval = NOTIFICATION_INTERVAL){
    return Promise.resolve(this.dispatch(NotificationConstants.NOTIFICATION_STARTING, msg))
      .then(() => wait(interval))
      .then(() => Promise.resolve(this.dispatch(NotificationConstants.NOTIFICATION_DONE)));
  }
}

module.exports = NotificationActions;
