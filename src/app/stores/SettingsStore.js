import Marty from 'marty';
import { Map } from 'immutable';
import SettingsConstants from '../constants/SettingsConstants';
import Settings from '../constants/Settings';

class SettingsStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      shareFreq: 2,
      locTtl: 1
    });

    this.handlers = {
      setShareFreq: SettingsConstants.SHARE_FREQUENCY_CHANGED,
      setLocTtl: SettingsConstants.LOC_TTL_CHANGED
    };
  }

  //handlers

  //(Number) -> Unit
  setShareFreq(index){
    this.replaceState(this.state.set('shareFreq', index));
  }

  // (Number) -> Unit
  setLocTtl(index){
    this.replaceState(this.state.set('locTtl', index));
  }

  //accessors

  // () -> Number
  getShareFreq(){
    return this.state.get('shareFreq');
  }

  // () -> Number
  getLocTtl(){
    return this.state.get('locTtl');
  }


}

export default SettingsStore;
