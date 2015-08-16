const Marty = require('marty');
const uuid = require('node-uuid');
const { Map, Record, fromJS } = require('immutable');

const LocPubConstants = require('../constants/LocPubConstants');
const LocSubConstants = require('../constants/LocSubConstants');
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
      setLastPing:[
        LocSubConstants.INIT_STARTING, LocSubConstants.REFRESH_STARTING],
      pollingOn: LocPubConstants.POLLING_ON,
      pollingOff: LocPubConstants.POLLING_OFF
    };
  }

  //HANDLERS

  // (UserLocation) -> Unit
  setLoc(loc){
    this.replaceState(this.state.set('loc', UserLocation(loc)));
  }

  // (Number) -> Unit
  setLastPing(millis){
    this.replaceState(this.state.set('lastPing', millis));
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

  // () -> UserLocationRefresh
  getLocRefresh(){
    return UserLocationRefresh({
      lastPing: this.state.get('lastPing'),
      location: this.state.get('loc')
    });
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

  // () -> Boolean
  firstPing(){
    return this.state.get('lastPing') === -1;
  }
}

module.exports = LocPubStore;
