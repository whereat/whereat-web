const chai = require('chai');
const should = chai.should();

const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const geo = require('../../app/modules/geo');
const wait = require('../../app/modules/async');
const { s17, s17_ } = require('../support/sampleLocations');

xdescribe('geo module', () => { //TODO: figure out how to test this!

  describe('#getCurrent', () => {

    describe('when browser supports geolocation', () => {

      it('returns the current location as Promise[LatLon]', () => {
        geo.getCurrent(fakeNavigator).should.eventually.equal('lalala');
      });
    });
  });
});
