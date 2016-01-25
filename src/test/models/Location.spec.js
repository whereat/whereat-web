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

import Location from '../../app/models/Location';
import { s17, s17UL } from '../support/sampleLocations';

describe('Location Record', () => {

  it('creates a Location from javascript object', () => {
    Location(s17)
      .equals(Location( {lat: s17.lat, lon: s17.lon, time: s17.time }))
      .should.equal(true);
  });

  it('drops extraneous fields from the record', () => {
    should.exist(s17UL.id);
    should.not.exist(Location(s17UL).get('id'));
  });

  it('allows access to fields via dot accessors', () => {
    const loc = Location(s17);
    loc.lat.should.equal(s17.lat);
    loc.lon.should.equal(s17.lon);
    loc.time.should.equal(s17.time);
  });

});
