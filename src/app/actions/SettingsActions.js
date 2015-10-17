const Marty = require('marty');
const SettingsConstants = require('../constants/SettingsConstants');

class SettingsActions extends Marty.ActionCreators {

  //(Number) -> Unit
  updateShare(index){
    this.dispatch(SettingsConstants.SHARE_INTERVAL_CHANGED, index);
  }

}

export default SettingsActions;
