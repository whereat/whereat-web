import Marty from 'marty';
import { Map } from 'immutable';
import SettingsConstants from '../constants/SettingsConstants';
import Settings from '../constants/Settings';

class SettingsStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      shareFreq: 2
    });

    this.handlers = {
      setShareFreq: SettingsConstants.SHARE_INTERVAL_CHANGED
    };
  }

  //handlers

  //(Number) -> Unit
  setShareFreq(index){
    this.replaceState(this.state.set('shareFreq', index));
  }

  //accessors

  getShareFreq(){
    return this.state.get('shareFreq');
  }
}

export default SettingsStore;
