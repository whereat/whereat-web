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

import { wait } from '../modules/async';
import geo from '../modules/geo';

import NotificationConstants from '../constants/NotificationConstants';
import LocPubConstants from '../constants/LocPubConstants';
import LocSubConstants from '../constants/LocSubConstants';
import GoButtonConstants from '../constants/GoButtonConstants';
import { NOTIFICATION_INTERVAL, USER_LOCATION_INTERVAL } from '../constants/Intervals';
import Location from '../models/Location';
import UserLocation from '../models/UserLocation';
import { partial } from 'lodash';
import sc from '../modules/scheduler';

class LocPubActions extends Marty.ActionCreators {

  // (NavigatorPosition, UserLocation => Unit, Number) -> Promise[Unit]
  publish(pos, ni = NOTIFICATION_INTERVAL){
    const userLoc = this._parseUserLoc(pos);
    return Promise
      .resolve(this.dispatch(LocPubConstants.USER_LOCATION_ACQUIRED, userLoc))
      .then(() => this.app.notificationActions.notify('Location shared.', ni))
      .then(() => this.app.locSubActions.update(userLoc));
  }

  // (NavigatorPosition) -> Location
  _parseUserLoc(pos){
    return UserLocation({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      time: pos.timestamp || new Date().getTime()
    });
  }

  // (Geo, Number, Number) -> Promise[Unit]
  ping(g = geo, ni = NOTIFICATION_INTERVAL){
    return g.get()
      .catch(err => Promise.reject(this.app.notificationActions.notify(err)))
      .then(pos => this.publish(pos, ni));
  }

  // (Number, Number) -> Promise[Unit]
  poll(shareFreq, ni = NOTIFICATION_INTERVAL){
    const id = sc.schedule(this.app.locPubActions.ping.bind(this), shareFreq);
    this.dispatch(LocPubConstants.POLLING_ON, id);
    return Promise.resolve(
      this.app.notificationActions.notify('Location sharing on.', ni));
  }

  // (Number, Number) -> Promise[Unit]
  stopPolling(id, ni = NOTIFICATION_INTERVAL){
    sc.cancel(id);
    this.dispatch(LocPubConstants.POLLING_OFF);
    return Promise.resolve(
      this.app.notificationActions.notify('Location sharing off.', ni));
  }

  // (Number, Number) -> Promise[Unit]
  resetPolling(pollId, shareFreq, ni = NOTIFICATION_INTERVAL){
    sc.cancel(pollId);
    const id = sc.schedule(this.ping.bind(this), shareFreq);
    this.dispatch(LocPubConstants.POLLING_RESET, id);
    return Promise.resolve(
      this.app.notificationActions.notify('Location sharing restarted.', ni));
  }

}

export default LocPubActions;
