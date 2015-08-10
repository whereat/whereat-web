const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const geo = require('../../src/modules/geo');
const wait = require('../../src/modules/async');
const { s17, s17_ } = require('../support/sampleLocations');

xdescribe('geo module', () => { //TODO: figure out how to test this!

  describe('#getCurrent', () => {

    describe('when browser supports geolocation', () => {

      it.only('returns the current location as Promise[LatLon]', () => {
        geo.getCurrent(fakeNavigator).should.eventually.equal('lalala');
      });
    });
  });
});
