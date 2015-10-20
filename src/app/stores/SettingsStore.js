import Marty from 'marty';
import { Map } from 'immutable';
import SettingsConstants from '../constants/SettingsConstants';
import Settings from '../constants/Settings';

class SettingsStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      share: 2
    });

    this.handlers = {
      setShare: SettingsConstants.SHARE_INTERVAL_CHANGED
    };
  }

  //handlers

  //(Number) -> Unit
  setShare(index){
    this.replaceState(this.state.set('share', index));
  }

  //accessors

  getShare(){
    return this.state.get('share');
  }
}

export default SettingsStore;
