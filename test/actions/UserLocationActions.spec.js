const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const Application = require('../../src/application');
const { createApplication } = require('marty/test-utils');
const {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
  shouldHaveDispatchedWithImmutable
} = require('../support/matchers');

const LocPubConstants = require('../../src/constants/LocPubConstants');
const LocSubConstants = require('../../src/constants/LocSubConstants');
const NotificationConstants = require('../../src/constants/NotificationConstants');
const GoButtonConstants = require('../../src/constants/GoButtonConstants');
const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');

const geo = require('../../src/modules/geo');
const { s17, s17Nav } = require('../support/sampleLocations');
const { toJS } = require('immutable');

describe('LocPubActions', () => {

  const setup = () => {
    return createApplication(Application, {
      include: ['locPubActions', 'notificationActions'] });
  };

  describe('#publish', () => {

    it('dispatches USER_LOCATION_ACQUIRED and passes loc', done => {
      const app = setup();
      app.locPubActions.publish(s17Nav, .0001).should.be.fulfilled
        .then(() => {
          shouldHaveDispatchedWithImmutable(app, LocPubConstants.USER_LOCATION_ACQUIRED, Location(s17));
        }).should.notify(done);
    });
  });

  describe('#ping', () => {

    const getStub = sinon.stub().returns(Promise.resolve(s17Nav));
    const geoStub = { get: getStub };

    it('acquires user location, dispatches to stores, notifies user', (done) => {
      const app = setup();

      app.locPubActions.ping(geoStub, .0001, .0001).should.be.fulfilled
        .then(() => {
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_ON);
          getStub.should.have.been.calledOnce;
          shouldHaveDispatchedWithImmutable(app,
            LocPubConstants.USER_LOCATION_ACQUIRED,
            Location(s17));
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_OFF);
          shouldHaveDispatchedWith(app,
            NotificationConstants.NOTIFICATION_STARTING, 'Location shared.');
          shouldHaveDispatched(app, NotificationConstants.NOTIFICATION_DONE);
        }).should.notify(done);
    });
  });

  describe('#_parseLoc', () => {

    it('parses a Location from a NavigatorPosition', () => {
      const app = setup();
      app.locPubActions._parseLoc(s17Nav)
        .equals(Location({
          lat: s17.lat,
          lon: s17.lon,
          time: s17.time
        })).should.equal(true);
    });
  });

  describe('#poll', () => {


    it('turns on user location polling, dispatches to stores, and notifies user', (done) => {

      const pollStub = sinon.stub().returns(1);
      const geoStub = { poll: pollStub };
      const app = setup();

      app.locPubActions.poll(geoStub, .0001).should.be.fulfilled
        .then(() => {
          pollStub.should.have.been.calledOnce;
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_ON);
          shouldHaveDispatchedWith(app, LocPubConstants.POLLING_ON, 1);
          shouldHaveDispatchedWith(app,
                                   NotificationConstants.NOTIFICATION_STARTING,
                                   'Location sharing on.');
          shouldHaveDispatched(app, NotificationConstants.NOTIFICATION_DONE);
        }).should.notify(done);
    });
  });

  describe('#stopPolling', () => {

    it('turns off user location polling, dispathces to stores, notifies user', (done) => {

      const stopPollingSpy = sinon.spy();
      const geoStub = { stopPolling: stopPollingSpy };
      const app = setup();

      app.locPubActions.stopPolling(1, geoStub, .0001).should.be.fulfilled
        .then(() => {
          stopPollingSpy.should.have.been.calledWith(1);
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_OFF);
          shouldHaveDispatched(app, LocPubConstants.POLLING_OFF);
          shouldHaveDispatchedWith(app,
                                   NotificationConstants.NOTIFICATION_STARTING,
                                   'Location sharing off.');
          shouldHaveDispatched(app, NotificationConstants.NOTIFICATION_DONE);
        }).should.notify(done);

    });
  });
});
