const Marty = require('marty');
const ToastConstants = require('../constants/ToastConstants');
const { EMPTY, PING, POLL } = require('../constants/ToastTypes');
const { Map } = require('immutable');

class ToastStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      visible: false,
      msg: ''
    });

    this.handlers = {
      show: ToastConstants.TOAST_STARTING,
      hide: ToastConstants.TOAST_DONE
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
module.exports = ToastStore;
