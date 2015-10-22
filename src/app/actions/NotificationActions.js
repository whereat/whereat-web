import Marty from 'marty';
import NotificationConstants from '../constants/NotificationConstants';
import { NOTIFICATION_INTERVAL } from '../constants/Intervals';
import { wait } from '../modules/async';

class NotificationActions extends Marty.ActionCreators {

  // (String) -> Promise[Unit]
  notify(msg, interval = NOTIFICATION_INTERVAL){
    return Promise.resolve(this.dispatch(NotificationConstants.NOTIFICATION_STARTING, msg))
      .then(() => wait(interval))
      .then(() => Promise.resolve(this.dispatch(NotificationConstants.NOTIFICATION_DONE)));
  }
}

export default NotificationActions;
