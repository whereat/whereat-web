import Marty from 'marty';
import SettingsConstants from '../constants/SettingsConstants';

class SettingsActions extends Marty.ActionCreators {

  //(Number) -> Unit
  setShareFreq(index){
    this.dispatch(SettingsConstants.SHARE_FREQUENCY_CHANGED, index);
  }

  // (Number) -> Unit
  setLocTtl(index){
    this.dispatch(SettingsConstants.LOC_TTL_CHANGED, index);
  }

}

export default SettingsActions;
