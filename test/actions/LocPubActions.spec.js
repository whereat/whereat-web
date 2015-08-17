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
  shouldHaveDispatchedWithImmutable,
  shouldHaveBeenCalledWithImmutable,
  shouldHaveObjectEquality
} = require('../support/matchers');

const LocPubConstants = require('../../src/constants/LocPubConstants');
const LocSubConstants = require('../../src/constants/LocSubConstants');
const NotificationConstants = require('../../src/constants/NotificationConstants');
const GoButtonConstants = require('../../src/constants/GoButtonConstants');
const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');

const geo = require('../../src/modules/geo');
const { s17, s17Nav } = require('../support/sampleLocations');
const { emptyState, ping1State, ping2State, pollState } = require('../support/samplePingStates');
const { toJS } = require('immutable');

describe('LocPubActions', () => {

  const setup = (state) => {

    const locSubSpies = {
      update: sinon.spy(),
      init: sinon.spy(),
      refresh: sinon.spy()
    };

    const notifySpies = {
      notify: sinon.spy()
    };

    const app = createApplication(Application, {
      include: ['locPubActions'],
      stub: {
        locSubActions: locSubSpies,
        notificationActions: notifySpies
      }
    });

    return [app, locSubSpies, notifySpies];
  };

  describe('#publish', () => {

    it('dispatches USER_LOCATION_ACQUIRED and passes loc to Notification and LocSub actions', done => {
      const [app, {update}, {notify}] = setup();
      const _parseUserLoc = sinon.spy(app.locPubActions, '_parseUserLoc');

      app.locPubActions.publish(s17Nav, .0001).should.be.fulfilled
        .then(() => {

          _parseUserLoc.should.have.been.calledWith(s17Nav);
          shouldHaveDispatchedWithImmutable(app, LocPubConstants.USER_LOCATION_ACQUIRED, UserLocation(s17));
          notify.should.have.been.calledWith('Location shared.');
          shouldHaveBeenCalledWithImmutable(update, UserLocation(s17));

          _parseUserLoc.restore();
        }).should.notify(done);
    });
  });

  describe('#_parseUserLoc', () => {

    it('parses a UserLocation from a NavigatorPosition', () => {
      const [app] = setup();

      shouldHaveObjectEquality(
        app.locPubActions._parseUserLoc(s17Nav),
        UserLocation(s17)
      );
    });
  });


  describe('#ping', () => {

    const getStub = sinon.stub().returns(Promise.resolve(s17Nav));
    const geoStub = { get: getStub };

    it('acquires user location, dispatches to stores, notifies user', done => {
      const [app] = setup();
      const publish = sinon.spy(app.locPubActions, 'publish');
      const _flash = sinon.spy(app.locPubActions, '_flash');

      app.locPubActions.ping(geoStub, .0001, .0001).should.be.fulfilled
        .then(() => {

          getStub.should.have.been.calledOnce;
          publish.should.have.been.calledWith(s17Nav, .0001);
          _flash.should.have.been.calledWith(.0001);

          publish.restore();
          _flash.restore();
        }).should.notify(done);
    });
  });

  describe('#_flash', () => {

    it('dispatches GO_BUTTON_ON then GO_BUTTON_OFF', done => {
      const [app] = setup();

      app.locPubActions._flash(.0001).should.be.fulfilled
        .then(() => {
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_ON);
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_OFF);
        }).should.notify(done);

    });
  });


  describe('#poll', () => {

    it('turns on location polling, dispatches, notifies user', (done) => {

      const [app, _, {notify}] = setup();
      const pollStub = sinon.stub().returns(1);
      const geoStub = { poll: pollStub };

      app.locPubActions.poll(geoStub, .0001).should.be.fulfilled
        .then(() => {

          pollStub.should.have.been.calledOnce;
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_ON);
          shouldHaveDispatchedWith(app, LocPubConstants.POLLING_ON, 1);
          notify.should.have.been.calledWith('Location sharing on.');

        }).should.notify(done);
    });
  });

  describe('#stopPolling', () => {

    it('turns off user location polling, dispathces to stores, notifies user', (done) => {

      const [app, _, {notify}] = setup();
      const stopPollingSpy = sinon.spy();
      const geoStub = { stopPolling: stopPollingSpy };

      app.locPubActions.stopPolling(1, geoStub, .0001).should.be.fulfilled
        .then(() => {
          stopPollingSpy.should.have.been.calledWith(1);
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_OFF);
          shouldHaveDispatched(app, LocPubConstants.POLLING_OFF);
          notify.should.have.been.calledWith('Location sharing off.')
        }).should.notify(done);

    });
  });
});
