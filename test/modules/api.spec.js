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

describe.only('Location API', () => {

  describe('#update', () => {

    describe('when passed a well-formatted UserLocationRefresh', () => {

      it('returns a Promise[Array[UserLocation]]', done => {
        api.update(UserLocationRefresh({ lastPing: 0, location: s17_UL }))
          .should.eventually.eql([s17UL, s17_UL])
          .and.notify(done);
      });
    });

    describe('when passed an incorrectly formatted UserLocationRefresh', () => {

      it('returns a Bad Request Error', done => {
        api.update(Location(s17))
          .should.eventually.eql(new Error(404))
          .and.notify(done);
      });
    });
  });

  describe('#init', () => {

    describe('when passed a well-formatted UserLocation', () => {

      it('returns a Promise[Array[UserLocation]]', done => {
        api.init(UserLocation(s17UL))
          .should.eventually.eql([s17UL])
          .and.notify(done);
      });
    });

    describe('when passed an incorrectly formatted UserLocation', () => {

      it('returns a Bad Request Error', done => {
        api.init(Location(s17))
          .should.eventually.eql(new Error(404))
          .and.notify(done);
      });
    });
  });

  describe('#refresh', () => {

    describe('when passed a well-formatted UserLocationRefresh', () => {

      it('returns a Promise[Array[UserLocation]]', done => {
        api.refresh(UserLocationRefresh({ lastPing: 0, location: s17_UL }))
          .should.eventually.eql([s17UL, s17_UL])
          .and.notify(done);
      });
    });

    describe('when passed an incorrectly formatted UserLocationRefresh', () => {

      it('returns a Bad Request Error', done => {
        api.init(Location(s17))
          .should.eventually.eql(new Error(404))
          .and.notify(done);
      });
    });
  });
});
