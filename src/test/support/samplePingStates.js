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

import { Map } from 'immutable';
import UserLocation from '../../app/models/UserLocation';
import { s17, s17_} from './sampleLocations';

const ps = {};

ps.emptyState = Map({
  loc: UserLocation(),
  polling: false,
  pollId: -1,
  lastPing: -1
});

ps.ping1State = Map({
  loc: UserLocation(s17),
  polling: false,
  pollId: -1,
  lastPing: -1
});

ps.ping2State = Map({
  loc: UserLocation(s17_),
  polling: false,
  pollId: -1,
  lastPing: s17.time
});

ps.pollState =  Map({
  loc: UserLocation(),
  polling: true,
  pollId: 1,
  lastPing: -1
});


module.exports = ps;
