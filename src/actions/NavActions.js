const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');

class NavActions extends Marty.ActionCreators {

  //(Page) -> Unit
  goto(page){
    this.dispatch(NavConstants.PAGE_REQUESTED, page);
  }
};

module.exports = NavActions;
