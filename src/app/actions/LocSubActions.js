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
import moment from 'moment';

import api from '../modules/api';
import time from '../modules/time';
import sc from '../modules/scheduler';

import LocSubConstants from '../constants/LocSubConstants';
import Location from '../models/Location';
import UserLocation from '../models/UserLocation';
import UserLocationRefresh from '../models/UserLocationRefresh';

import { FORGET_INTERVAL, NOTIFICATION_INTERVAL } from '../constants/Intervals';

class LocSubActions extends Marty.ActionCreators {

  // (UserLocation, () => Number) -> Promise[Unit]
  update(userLocation, now = time.now){
    const req = UserLocationRefresh({
      lastPing: this.app.locPubStore.getLastPing(),
      location: UserLocation(userLocation)
    });
    return Promise
      .resolve(this.dispatch(LocSubConstants.UPDATE_STARTING, now())) // overwrites `lastPing`
      .then(() => api.update(req))
      .then(locs => this.dispatch(LocSubConstants.LOCATIONS_RECEIVED, locs));
  }

  //() -> Promise[Unit]
  refresh(){
    return Promise
      .resolve(this.dispatch(LocSubConstants.LOC_REFRESH_TRIGGERED))
      .then(() => this.app.locPubActions.ping());
  }

  // (Number, Number) => Promise[Unit]
  forget(ttl, now = time.now()){
    this.dispatch(LocSubConstants.LOCATION_FORGET_TRIGGERED, ttl, now);
    return Promise.resolve(
      this.app.notificationActions.notify(
        `Deleting location data older than ${moment(now - ttl).format('dddd h:mmA')}`));
  }

  // (Number) -> Unit
  scheduleForget(ttl){
    const id = sc.schedule(this.forget.bind(this, ttl), FORGET_INTERVAL);
    this.dispatch(LocSubConstants.LOC_FORGET_SCHEDULED, id);
  }

  // (Number, Number) -> Unit
  rescheduleForget(jobId, ttl, ni = NOTIFICATION_INTERVAL){
    sc.cancel(jobId);
    const id = sc.schedule(this.forget.bind(this, ttl), FORGET_INTERVAL);
    this.dispatch(LocSubConstants.LOC_FORGET_RESCHEDULED, id);
    return Promise.resolve(
      this.app.notificationActions.notify('Restarting data deletion.'), ni);
  }
}

export default LocSubActions;
