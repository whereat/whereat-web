const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const { HOME, MAP } = require('../constants/Pages');
const { Map } = require('immutable');

class NavStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      page: HOME,
      expanded: false
    });

    this.handlers = {
      goto: NavConstants.PAGE_REQUESTED,
      toggle: [NavConstants.NAV_TOGGLED, NavConstants.PAGE_REQUESTED]
    };
  }

  //HANDLERS

  // (Page) -> Unit
  goto(page){
    this.replaceState(
      this.state.merge(
        Map({ page: page })));
  }

  // () -> Unit
  toggle(){
    this.replaceState(
      this.state.merge(
        Map({ expanded: !this.state.get('expanded')})));
  }

  //ACCESSORS

  // () -> Page
  getPage(){
    return this.state.get('page');
  }

  // () -> Boolean
  isExpanded(){
    return this.state.get('expanded');
  }
}

module.exports = NavStore;
