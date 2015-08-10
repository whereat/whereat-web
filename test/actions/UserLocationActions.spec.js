const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const Application = require('../../src/application');
const { hasDispatched, createApplication } = require('marty/test-utils');

const UserLocationConstants = require('../../src/constants/UserLocationConstants');
const LocationConstants = require('../../src/constants/LocationConstants');
const NotificationConstants = require('../../src/constants/NotificationConstants');
const GoButtonConstants = require('../../src/constants/GoButtonConstants');
const geo = require('../../src/modules/geo');
const { s17, s17Nav } = require('../support/sampleLocations');

describe('UserLocationActions', () => {

  const locOf = (ul) => ({ lat: ul.lat, lon: ul.lon, time: ul.time });

  const setup = () => {
    return createApplication(Application, { include: ['userLocationActions', 'notificationActions'] });
  };

  describe('#publish', () => {

    it('dispatches USER_LOCATION_ACQUIRED and passes loc', done => {
      const app = setup();
      app.userLocationActions.publish(s17Nav, .0001).should.be.fulfilled
        .then(() => {
          hasDispatched(
            app, UserLocationConstants.USER_LOCATION_ACQUIRED, locOf(s17))
            .should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#ping', () => {

    const getStub = sinon.stub().returns(Promise.resolve(s17Nav));
    const geoStub = { get: getStub };

    it('acquires user location, dispatches to stores, notifies user', (done) => {
      const app = setup();

      app.userLocationActions.ping(geoStub, .0001, .0001).should.be.fulfilled
        .then(() => {
          hasDispatched(app, GoButtonConstants.GO_BUTTON_ON).should.equal(true);
          getStub.should.have.been.calledOnce;
          hasDispatched(
            app, UserLocationConstants.USER_LOCATION_ACQUIRED, locOf(s17))
            .should.equal(true);
          hasDispatched(
            app, GoButtonConstants.GO_BUTTON_OFF)
            .should.equal(true);
          hasDispatched(
            app,
            NotificationConstants.NOTIFICATION_STARTING,
            `Location shared: ${JSON.stringify(locOf(s17), null, 2)}`
          ).should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_DONE)
            .should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#_parseLoc', () => {

    it('parses a Location from a NavigatorPosition', () => {
      const app = setup();
      app.userLocationActions._parseLoc(s17Nav).should.eql({
        lat: s17.lat,
        lon: s17.lon,
        time: s17.time
      });
    });
  });

  describe('#poll', () => {


    it('turns on user location polling, dispatches to stores, and notifies user', (done) => {

      const pollStub = sinon.stub().returns(1);
      const geoStub = { poll: pollStub };
      const app = setup();

      app.userLocationActions.poll(geoStub, .0001).should.be.fulfilled
        .then(() => {
          pollStub.should.have.been.calledOnce;
          hasDispatched(
            app, GoButtonConstants.GO_BUTTON_ON)
            .should.equal(true);
          hasDispatched(
            app, UserLocationConstants.POLLING_ON, 1)
            .should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_STARTING, 'Location sharing on.')
            .should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_DONE)
            .should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#stopPolling', () => {

    it('turns off user location polling, dispathces to stores, notifies user', (done) => {

      const stopPollingSpy = sinon.spy();
      const geoStub = { stopPolling: stopPollingSpy };
      const app = setup();

      app.userLocationActions.stopPolling(1, geoStub, .0001).should.be.fulfilled
        .then(() => {
          stopPollingSpy.should.have.been.calledWith(1);
          hasDispatched(
            app, GoButtonConstants.GO_BUTTON_OFF)
            .should.equal(true);
          hasDispatched(
            app, UserLocationConstants.POLLING_OFF)
            .should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_STARTING, 'Location sharing off.')
            .should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_DONE)
            .should.equal(true);
        }).should.notify(done);

    });
  });
});
