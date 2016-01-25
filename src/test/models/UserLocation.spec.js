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

import chai from 'chai';
const should = chai.should();

import UserLocation from '../../app/models/UserLocation';
import Location from '../../app/models/Location';

import { s17, s17_, s17UL} from '../support/sampleLocations';
import { USER_ID } from '../../app/constants/Keys';

describe('UserLocation Record', () => {

  it('creates a UserLocation from javascript object', () => {
    const l = s17UL;
    UserLocation(l)
      .equals(UserLocation({ id: l.id, lat: l.lat, lon: l.lon, time: l.time }))
      .should.equal(true);
  });

  it('creates a UserLocation from javascript object missing fields', () => {
    UserLocation(s17)
      .equals(UserLocation({
        id: USER_ID,
        lat: s17.lat,
        lon: s17.lon,
        time: s17.time
      })).should.equal(true);
  });


  it('creates a UserLocation from a Location', () => {
    UserLocation(Location(s17))
      .equals(UserLocation({
        id: USER_ID,
        lat: s17.lat,
        lon: s17.lon,
        time: s17.time
      })).should.equal(true);
  });



  it('allows access to fields via dot accessors', () => {
    const loc = UserLocation(s17);
    loc.id.should.equal(USER_ID);
    loc.lat.should.equal(s17.lat);
    loc.lon.should.equal(s17.lon);
    loc.time.should.equal(s17.time);
  });

});
