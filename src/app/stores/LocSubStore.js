/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import Marty from 'marty';

import LocSubConstants from '../constants/LocSubConstants';
import LocPubConstants from '../constants/LocPubConstants';
import SettingsConstants from '../constants/SettingsConstants';

import UserLocation from '../models/UserLocation';
import Location from '../models/Location';
import { convertPosition } from '../models/LocationCompanion';

import { Map, List } from 'immutable';
import moment from 'moment';
import geo from '../modules/geo';


class LocSubStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({locs: Map(), forgetJob: -1 });
    this.state.set('center', this.getCenter());

    this.handlers = {
      save: LocSubConstants.LOCATION_RECEIVED,
      saveMany: LocSubConstants.LOCATIONS_RECEIVED,
      clear: LocSubConstants.LOC_REFRESH_TRIGGERED,
      recordForgetJob: [
        LocSubConstants.LOC_FORGET_SCHEDULED,
        LocSubConstants.LOC_FORGET_RESCHEDULED
      ],
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
  recordForgetJob(id){
    this.replaceState(this.state.set('forgetJob', id));
  }

  // (Number, Number) -> Unit
  forget(ttl, now){
    const expired = this.state.get('locs')
            .valueSeq()
            .filter(l => l.time <= now - ttl);
    this.replaceState(
      expired.reduce(
        (acc, loc) => acc.deleteIn(['locs', loc.id]), this.state, this));
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


  // () -> Number
  getForgetJob(){
    return this.state.get('forgetJob');
  }

}

export default LocSubStore;
