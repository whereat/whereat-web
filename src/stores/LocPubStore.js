const Marty = require('marty');
const uuid = require('node-uuid');
const { Map, Record, fromJS } = require('immutable');

const LocPubConstants = require('../constants/LocPubConstants');
const UserLocation = require('../models/UserLocation');
const UserLocationRefresh = require('../models/UserLocationRefresh');


class LocPubStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      loc: UserLocation(), // UserLocation
      polling: false, // Boolean
      pollId: -1, // Number
      lastPing: -1 // Number
    });

    this.handlers = {
      setLoc: LocPubConstants.USER_LOCATION_ACQUIRED,
      pollingOn: LocPubConstants.POLLING_ON,
      pollingOff: LocPubConstants.POLLING_OFF
    };
  }

  //HANDLERS

  // (UserLocation, Number) -> Unit
  setLoc(loc){
    this._relay(loc);
    this.replaceState(
      this.state.mergeDeep( Map({ loc: UserLocation(loc), lastPing: loc.time })));
  }

  // (UserLocation) -> Unit
  _relay(loc){
    this._firstPing() ?
      this.app.locSubActions.init(
        UserLocation(loc)) :
      this.app.locSubActions.refresh(
        UserLocationRefresh({lastPing: this.state.get('lastPing'), location: UserLocation(loc)}));
  }

  // () -> Boolean
  _firstPing(){
    return this.state.get('lastPing') === -1;
  }

  // (Number) -> Unit
  pollingOn(id){
    this.replaceState(
      this.state.mergeDeep( Map({ polling: true, pollId: id })));
  }

  // () -> Unit
  pollingOff(){
    this.replaceState(
      this.state.mergeDeep( Map({ polling: false, pollId: -1 })));
  }

  //ACCESSORS

  // () -> UserLocation
  getLoc(){
    return this.state.get('loc');
  }

  // () -> Boolean
  isPolling(){
    return this.state.get('polling');
  }

  // () -> Number
  getPollId(){
    return this.state.get('pollId');
  }

  // () -> Number
  getLastPing(){
    return this.state.get('lastPing');
  }
}

module.exports = LocPubStore;
