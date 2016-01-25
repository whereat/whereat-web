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
import chaiAsPromised from 'chai-as-promised';
const should = chai.should();
chai.use(chaiAsPromised);

import http from 'superagent';
import config from '../support/mocks/server/config';
require('superagent-mock')(http, config);

import api from '../../app/modules/api';
import { s17, s17UL, s17_, s17_UL } from '../support/sampleLocations';

import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';
import UserLocationRefresh from '../../app/models/UserLocationRefresh';
import User from '../../app/models/User';
import { USER_ID } from '../../app/constants/Keys';

describe('Location API', () => {

  describe('#update', () => {

    describe('when passed a well-formatted UserLocationRefresh', () => {

      it('returns a Promise[Array[UserLocation]]', done => {
        api.update(UserLocationRefresh({ lastPing: s17.time, location: s17_UL }))
          .should.eventually.eql([s17UL, s17_UL])
          .and.notify(done);
      });
    });

    describe('when passed an incorrectly formatted UserLocationRefresh', () => {

      it('returns a Bad Request Error', done => {
        api.update(Location(s17))
          .should.eventually.eql(new Error('Bad Request'))
          .and.notify(done);
      });
    });
  });

  describe('#remove', () => {

    describe('when passed a well-formatted User', () => {

      it('returns a notification of deletion', done => {
        api.remove(User({ id: USER_ID }))
          .should.eventually.eql('1 record(s) deleted.')
          .and.notify(done);
      });
    });

    describe('when passed an incorrectly formatted User', () => {

      it('returns a Bad Request Error', done => {
        api.remove(Location(s17))
          .should.eventually.eql(new Error ('Bad Request'))
          .and.notify(done);
      });
    });
  });


});
