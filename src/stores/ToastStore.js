const Marty = require('marty');
const ToastConstants = require('../constants/ToastConstants');
const { EMPTY, PING, POLL } = require('../constants/ToastTypes');
const { Map } = require('immutable');

class ToastStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      visible: false,
      type: EMPTY
    });

    this.handlers = {
      show: ToastConstants.TOAST_STARTING,
      hide: ToastConstants.TOAST_DONE
    };
  }

  //HANDLERS

  // (ToastType) -> Unit
  show(type){
    this.replaceState(this.state.set('visible', true).set('type', type));
  }

  // () -> Unit
  hide(){
    this.replaceState(this.state.set('visible', false).set('type', EMPTY));
  }

  //ACCESSORS
  getType(){
    return this.state.get('type');
  }

}

module.exports = ToastStore;
