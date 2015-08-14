const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(chaiAsPromised);

const http = require('superagent');
const config = require('../support/mocks/server/config');
require('superagent-mock')(http, config);

const api = require('../../src/modules/api');
const { initRequest, initResponse } = require('../support/sampleLocations');

const UserLocation = require('../../src/models/UserLocation');
const Location = require('../../src/models/Location');

describe.only('Location API', () => {

  describe('#init', () => {

    describe('when passed a well-formatted UserLocation', () => {

      it('returns a Promise[Array[UserLocation]]', done => {
        api.init(UserLocation(initRequest))
          .should.eventually.eql(initResponse)
          .and.notify(done);
      });
    });

    describe('when passed an incorrectly formatted UserLocation', () => {

      it('returns a 404 Error', done => {
        api.init(Location(initRequest))
          .should.eventually.eql(new Error(404))
          .and.notify(done);
      });
    });
  });
});
