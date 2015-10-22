import Marty from 'marty';
import NavConstants from '../constants/NavConstants';

class NavActions extends Marty.ActionCreators {

  //(Page) -> Unit
  goto(page){
    this.dispatch(NavConstants.PAGE_REQUESTED, page);
  }

  // () -> Unit
  toggle(){
    this.dispatch(NavConstants.NAV_TOGGLED);
  }
}

export default NavActions;
