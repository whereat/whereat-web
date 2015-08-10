const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const Application = require('../../src/application');
const { hasDispatched, createApplication } = require('marty/test-utils');

const ShareConstants = require('../../src/constants/ShareConstants');
const LocationConstants = require('../../src/constants/LocationConstants');
const NotificationConstants = require('../../src/constants/NotificationConstants');
const GoButtonConstants = require('../../src/constants/GoButtonConstants');
const geo = require('../../src/modules/geo');
const { s17 } = require('../support/sampleLocations');

describe('ShareActions', () => {

  const setup = () => {
    return createApplication(Application, { include: ['shareActions', 'notificationActions'] });
  };

  describe('#publish', () => {

    it('dispatches USER_LOCATION_ACQUIRED and passes loc', done => {
      const app = setup();
      app.shareActions.publish(s17).should.be.fulfilled
        .then(() => {
          hasDispatched(
            app, LocationConstants.USER_LOCATION_ACQUIRED, s17)
            .should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#ping', () => {

    const getStub = sinon.stub().returns(Promise.resolve(s17));
    const geoStub = { get: getStub };

    it('acquires user location, dispatches to stores, notifies user', (done) => {
      const app = setup();

      app.shareActions.ping(geoStub, .0001, .0001).should.be.fulfilled
        .then(() => {
          hasDispatched(app, GoButtonConstants.GO_BUTTON_ON).should.equal(true);
          getStub.should.have.been.calledOnce;
          hasDispatched(
            app, LocationConstants.USER_LOCATION_ACQUIRED, s17)
            .should.equal(true);
          hasDispatched(
            app, GoButtonConstants.GO_BUTTON_OFF)
            .should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_STARTING, `Location shared: ${JSON.stringify(s17, null, 2)}`)
            .should.equal(true);
          hasDispatched(
            app, NotificationConstants.NOTIFICATION_DONE)
            .should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#poll', () => {


    it('turns on user location polling, dispatches to stores, and notifies user', (done) => {

      const pollStub = sinon.stub().returns(1);
      const geoStub = { poll: pollStub };
      const app = setup();

      app.shareActions.poll(geoStub, .0001).should.be.fulfilled
        .then(() => {
          pollStub.should.have.been.calledOnce;
          hasDispatched(
            app, GoButtonConstants.GO_BUTTON_ON)
            .should.equal(true);
          hasDispatched(
            app, ShareConstants.POLLING_ON, 1)
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

      app.shareActions.stopPolling(1, geoStub, .0001).should.be.fulfilled
        .then(() => {
          stopPollingSpy.should.have.been.calledWith(1);
          hasDispatched(
            app, GoButtonConstants.GO_BUTTON_OFF)
            .should.equal(true);
          hasDispatched(
            app, ShareConstants.POLLING_OFF)
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
