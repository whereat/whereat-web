const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const { Map } = require('immutable');

class GoButtonStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      displayed: 'home'
    });

    this.handlers = {
      on: NavConstants.PING_STARTING,
      off: NavConstants.PING_DONE,
      toggle: NavConstants.POLL_TOGGLED
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
