import Marty from 'marty';
import NotificationConstants from '../constants/NotificationConstants';
import { Map } from 'immutable';

class NotificationStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      visible: false,
      msg: ''
    });

    this.handlers = {
      show: NotificationConstants.NOTIFICATION_STARTING,
      hide: NotificationConstants.NOTIFICATION_DONE
    };
  }

  //HANDLERS

  // (String) -> Unit
  show(msg){
    this.replaceState(this.state.set('visible', true).set('msg', msg));
  }

  // () -> Unit
  hide(){
    this.replaceState(this.state.set('visible', false).set('msg', ''));
  }

  //ACCESSORS

  isVisible(){
    return this.state.get('visible');
  }

  getMsg(){
    return this.state.get('msg');
  }
}
export default NotificationStore;
