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

import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import geo from '../../app/modules/geo';
import wait from '../../app/modules/async';
import { s17, s17_ } from '../support/sampleLocations';

xdescribe('geo module', () => { //TODO: figure out how to test this!

  describe('#getCurrent', () => {

    describe('when browser supports geolocation', () => {

      it('returns the current location as Promise[LatLon]', () => {
        geo.getCurrent(fakeNavigator).should.eventually.equal('lalala');
      });
    });
  });
});
