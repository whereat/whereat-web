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
import { Map, Record, fromJS } from 'immutable';

import LocPubConstants from '../constants/LocPubConstants';
import LocSubConstants from '../constants/LocSubConstants';
import UserLocation from '../models/UserLocation';
import UserLocationRefresh from '../models/UserLocationRefresh';


class LocPubStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      loc: UserLocation(), // UserLocation
      polling: true, // Boolean
      pollId: -1, // Number
      lastPing: -1 // Number
    });

    this.handlers = {
      setLoc: LocPubConstants.USER_LOCATION_ACQUIRED,
      setLastPing:[LocSubConstants.UPDATE_STARTING, LocSubConstants.REMOVE_STARTING],
      pollingOn: LocPubConstants.POLLING_ON,
      pollingOff: LocPubConstants.POLLING_OFF,
      pollingReset: LocPubConstants.POLLING_RESET
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

  // (Number) -> Unit
  pollingReset(id){
    this.replaceState(this.state.set('pollId', id));
  }

  //ACCESSORS

  // () -> Boolean
  hasLoc(){
    return !this.state.get('loc').equals(UserLocation());
  }

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

export default LocPubStore;
