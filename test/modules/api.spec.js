const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const api = require('../../src/modules/api');
const wait = require('../../src/modules/async');
const { s17, initResponseJSON, initResponseJS } = require('../support/sampleLocations');
const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');

describe('Location API', () => {

  const setup1 = () => {
    const server = sinon.fakeServer.create();
    server.respondWith(
      'POST', '/locations/init/', // where to put body of request?
      [ 200, { 'Content-Type': 'application/json'}, initResponseJSON ]
    );
    return server;
  };

  const setup2 = (endpoint) => {
    const server = sinon.fakeServer.create();
    const req = server.requests[0];
    if (JSON.parse(req).equals(s17)){
      req.respond(200, '...');
    } else {
      req.respond(404, '...');
    }
  };


  describe('#init', () => {

    //TODO: make sample data, figure out where to put body

    it('consumes a UserLocation, produces a Promise[Array[UserLocation]]', () =>{
      api.init(s17).should.eventually.equal(initResponseJS);
    });
  });
});
