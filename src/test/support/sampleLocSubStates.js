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

import {Map} from 'immutable';
import { nyse3ULSeq as ls } from './sampleLocations';
import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';
import { s17, s17UL, s17_UL, nyse3Seq, nyse3ULSeq } from '../support/sampleLocations';

const nyse3State =  Map({
  center: Location(s17),
  locs: Map([
    [ls.get(0).id, ls.get(0)],
    [ls.get(1).id, ls.get(1)],
    [ls.get(2).id, ls.get(2)]
  ]),
  locTtl: 1,
  forgetJob: -1
});

export default {
  clearState: Map({
    center: Location(s17),
    locs: Map(),
    locTtl: 1,
    forgetJob: -1
  }),
  nyse3State: nyse3State,
  nyse3ModTimeState: nyse3State.setIn(['locs', ls.get(2).id], ls.get(2).time + 20),
  nyse3ModTtlState: nyse3State.set('locTtl', 0),
  nyse3ModForgetJobState: nyse3State.set('forgetJob', 1)
};
