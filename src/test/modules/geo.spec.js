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
