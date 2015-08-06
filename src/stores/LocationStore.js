const Marty = require('marty');
const LocationConstants = require('../constants/LocationConstants');
const { Map, List } = require('immutable');
const { nyse3 } = require('../../test/support/sampleLocations');

class LocationStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map();
    this.saveMany(nyse3);

    this.handlers = {
      save: LocationConstants.LOCATION_RECEIVED,
      saveMany: LocationConstants.LOCATIONS_RECEIVED
    };
  }

  //HANDLERS

  //(Location) -> Unit
  save(loc){
    this.replaceState(this.state.set(loc.id, loc));
  }

  // (List[Location]) -> Unit
  saveMany(locs){
    locs.map(this.save.bind(this));
  }

  //ACCESSORS
  getAll(){
    return this.state.valueSeq();
  }

}

module.exports = LocationStore;
