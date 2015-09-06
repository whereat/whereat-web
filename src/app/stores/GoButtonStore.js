const Marty = require('marty');
const { Map } = require('immutable');
const GoButtonConstants = require('../constants/GoButtonConstants');
const { RED, GREEN } = require('../constants/Colors');

class GoButtonStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      color: RED
    });

    this.handlers = {
      on: GoButtonConstants.GO_BUTTON_ON,
      off: GoButtonConstants.GO_BUTTON_OFF
    };
  }

  //handlers

  on(){
    this.replaceState(Map({color: GREEN }));
  }

  off(){
    this.replaceState(Map({color: RED }));
  }

  //accessors

  getColor(){
    return this.state.get('color');
  }
}

module.exports = GoButtonStore;
