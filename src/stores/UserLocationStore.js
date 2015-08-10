const Marty = require('marty');
const uuid = require('node-uuid');
const { Map, Record } = require('immutable');

const UserLocationConstants = require('../constants/UserLocationConstants');
const UserLocation = require('../models/UserLocation');

class UserLocationStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      polling: false, // Boolean
      pollId: -1, // Number
      uid: uuid.v4(), // String
      loc: Map() // UserLocation
    });

    this.handlers = {
      setLoc: UserLocationConstants.USER_LOCATION_ACQUIRED,
      pollingOn: UserLocationConstants.POLLING_ON,
      pollingOff: UserLocationConstants.POLLING_OFF
    };
  }

  //HANDLERS

  // (Location) -> Unit
  // where location has form: { lat: Number, lon: Number, time: Number}
  // TODO: make this more typesafe with a Location record?
  setLoc(loc){
    this.replaceState(
      this.state.mergeDeep( Map({ loc: Map(loc) })));
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

}

module.exports = UserLocationStore;
