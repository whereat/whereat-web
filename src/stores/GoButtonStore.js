const Marty = require('marty');
const ShareConstants = require('../constants/ShareConstants');
const { Map } = require('immutable');

const red = '#dd3b47';
const green = '#30ff40';

class GoButtonStore extends Marty.Store {

  constructor(options){
    super(options);
    const red = '#dd3b47';
    this.state = Map({
      color: '#dd3b47'
    });

    this.handlers = {
      on: ShareConstants.PING_STARTING,
      off: ShareConstants.PING_DONE,
      toggle: ShareConstants.POLL_TOGGLED
    };
  }

  on(){
    this.replaceState(Map({color: green}));
  }

  off(){
    this.replaceState(Map({color: red}));
  }

  toggle(){
    this.state.get('color') === red ?
      this.replaceState(Map({ color: green })) :
      this.replaceState(Map({ color: red }));
  }
}

module.exports = GoButtonStore;
