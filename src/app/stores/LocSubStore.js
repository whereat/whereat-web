const Marty = require('marty');

const LocSubConstants = require('../constants/LocSubConstants');
const LocPubConstants = require('../constants/LocPubConstants');
const UserLocation = require('../models/UserLocation');
const Location = require('../models/Location');
const { convertPosition } = require('../models/LocationCompanion');

const { Map, List } = require('immutable');
const geo = require('../modules/geo');

class LocSubStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({locs: Map()});
    this.state.set('center', this.getCenter());

    this.handlers = {
      save: LocSubConstants.LOCATION_RECEIVED,
      saveMany: LocSubConstants.LOCATIONS_RECEIVED,
      clear: LocSubConstants.USER_REMOVED,
      forget: LocSubConstants.LOCATION_FORGET_TRIGGERED
    };
  }

  //HANDLERS

  //(UserLocation) -> Unit
  save(loc){
    const ul = UserLocation(loc);
    this.replaceState(this.state.setIn(['locs', ul.id], ul));
  }

  // (Seq[UserLocation]) -> Unit
  saveMany(locs){
    this.replaceState(
      locs.reduce(
        (acc, loc) => acc.setIn(['locs', loc.id], UserLocation(loc)),
        this.state,
        this));
  }

  // () -> Unit
  clear(){
    this.replaceState(this.state.set('locs', Map()));
  }

  // (Number) -> Unit
  forget(now){
    const hourAgo = now - (60 * 60 * 1000);
    const expiredLocs = this.state.get('locs').valueSeq().filter(l => l.time <= hourAgo);
    this.replaceState(
      expiredLocs.reduce(
        (acc, loc) => acc.deleteIn(['locs', loc.id]),
        this.state,
        this));
  }

  //ACCESSORS

  // () -> UserLocation
  getCenter(){
    return this.fetch({
      id: 'getCenter',
      locally(){
        return this.state.get('center');
      },
      remotely(){
        return geo.get()
          .then(pos => {
            const loc = convertPosition(pos);
            this.replaceState(this.state.set('center', loc));
            Promise.resolve(loc);
          });
      }
    });
  }

  // () -> UserLocation
  getLocs(){
    return this.state.get('locs').valueSeq();
  }

}

module.exports = LocSubStore;
