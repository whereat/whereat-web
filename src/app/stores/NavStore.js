const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const { HOME, MAP, SEC } = require('../constants/Pages');
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
      hide: NavConstants.PAGE_REQUESTED,
      toggle: NavConstants.NAV_TOGGLED
    };
  }

  //HANDLERS

  // (Page) -> Unit
  goto(page){
    this.replaceState(this.state.set('page', page ));
  }

  // () -> Unit
  hide(){
    this.replaceState(this.state.set('expanded', false));
  }

  // () -> Unit
  toggle(){
    this.replaceState(this.state.set('expanded', !this.state.get('expanded')));
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
