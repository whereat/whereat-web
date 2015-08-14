const Marty = require('marty');
const uuid = require('node-uuid');
const { Map, Record, fromJS } = require('immutable');

const UserLocationConstants = require('../constants/UserLocationConstants');
const UserLocation = require('../models/UserLocation');

class UserLocationStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      loc: UserLocation(), // UserLocation
      polling: false, // Boolean
      pollId: -1, // Number
      lastPing: -1 // Number
    });

    this.handlers = {
      setLoc: UserLocationConstants.USER_LOCATION_ACQUIRED,
      pollingOn: UserLocationConstants.POLLING_ON,
      pollingOff: UserLocationConstants.POLLING_OFF
    };
  }

  //HANDLERS

  // (UserLocation, Number) -> Unit
  setLoc(loc){
    this.replaceState(
      this.state.mergeDeep( Map({ loc: UserLocation(loc), lastPing: loc.time })));
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

module.exports = UserLocationStore;
