const Marty = require('marty');
const ShareConstants = require('../constants/ShareConstants');
const { Map } = require('immutable');
const { RED, GREEN } = require('../../src/constants/Colors');

class GoButtonStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      color: RED
    });

    this.handlers = {
      on: ShareConstants.PING_STARTING,
      off: ShareConstants.PING_DONE,
      toggle: ShareConstants.POLL_TOGGLED
    };
  }

  //handlers

  on(){
    this.replaceState(Map({color: GREEN }));
  }

  off(){
    this.replaceState(Map({color: RED }));
  }

  toggle(){
    this.state.get('color') === RED ?
      this.replaceState(Map({ color: GREEN })) :
      this.replaceState(Map({ color: RED }));
  }

  //accessors

  getColor(){
    return this.state.get('color');
  }
}

module.exports = GoButtonStore;
