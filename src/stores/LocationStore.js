const Marty = require('marty');

const LocationConstants = require('../constants/LocationConstants');
const UserLocationConstants = require('../constants/UserLocationConstants');
const UserLocation = require('../models/UserLocation');

const { Map, List } = require('immutable');
const { nyse2, nyse3Seq } = require('../../test/support/sampleLocations');

class LocationStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map();

    this.handlers = {
      save: [
        LocationConstants.LOCATION_RECEIVED, // TODO: remove once LocationApi implemented
        UserLocationConstants.USER_LOCATION_ACQUIRED],
      saveMany: LocationConstants.LOCATIONS_RECEIVED
    };
  }

  //HANDLERS

  //(UserLocation) -> Unit
  save(loc){
    const l = UserLocation(loc);
    this.replaceState(this.state.set(l.id, l));
  }

  // (Seq[UserLocation]) -> Unit
  saveMany(locs){
    this.replaceState(
      locs.reduce((acc, loc) => acc.set(loc.id, loc), this.state, this));
  }

  //ACCESSORS

  // () -> UserLocation
  getAll(){
    return this.state.valueSeq();
  }

}

module.exports = LocationStore;
