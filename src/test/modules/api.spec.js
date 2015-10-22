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
