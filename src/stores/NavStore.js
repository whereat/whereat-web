const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const { HOME, MAP } = require('../constants/Pages');
const { Map } = require('immutable');

class NavStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      page: HOME
    });

    this.handlers = {
      goto: NavConstants.PAGE_REQUESTED
    };
  }

  //handlers

  // (Page) -> Unit
  goto(page){
    this.replaceState(Map({ page: page }));
  }

  //accessors

  // () -> Page
  getPage(){
    return this.state.get('page');
  }
}

module.exports = NavStore;
