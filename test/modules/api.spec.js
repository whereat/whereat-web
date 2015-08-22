const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(chaiAsPromised);

const http = require('superagent');
const config = require('../support/mocks/server/config');
require('superagent-mock')(http, config);

const api = require('../../src/modules/api');
const { s17, s17UL, s17_, s17_UL } = require('../support/sampleLocations');

const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');
const UserLocationRefresh = require('../../src/models/UserLocationRefresh');
const User = require('../../src/models/User');
const { USER_ID } = require('../../src/constants/Keys');

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
