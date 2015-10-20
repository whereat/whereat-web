const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const Application = require('../../app/application');
const { createApplication } = require('marty/test-utils');

const {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
  shouldHaveDispatchedWithImmutable,
  shouldHaveBeenCalledWithImmutable,
  shouldHaveObjectEquality
} = require('../support/matchers');

const LocPubConstants = require('../../app/constants/LocPubConstants');
const LocSubConstants = require('../../app/constants/LocSubConstants');
const NotificationConstants = require('../../app/constants/NotificationConstants');
const GoButtonConstants = require('../../app/constants/GoButtonConstants');
const Location = require('../../app/models/Location');
const UserLocation = require('../../app/models/UserLocation');

const geo = require('../../app/modules/geo');
const sc = require('../../app/modules/scheduler');
const { s17, s17Nav } = require('../support/sampleLocations');
const { emptyState, ping1State, ping2State, pollState } = require('../support/samplePingStates');
const { toJS } = require('immutable');

describe('LocPubActions', () => {

  const setup = () => {

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
      const [app, {update}, {notify} ] = setup();
      const _parseUserLoc = sinon.spy(app.locPubActions, '_parseUserLoc');

      app.locPubActions.publish(s17Nav, .0001).should.be.fulfilled
        .then(() => {

          _parseUserLoc.should.have.been.calledWith(s17Nav);
          shouldHaveDispatchedWithImmutable(app, LocPubConstants.USER_LOCATION_ACQUIRED, UserLocation(s17));
          notify.should.have.been.calledWith('Location shared.');
          shouldHaveBeenCalledWithImmutable(update, UserLocation(s17));

        }).should.notify(done);
      _parseUserLoc.restore();
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

    describe('when location services enabled', () => {
      const getStub = sinon.stub().returns(Promise.resolve(s17Nav));
      const geoStub = { get: getStub };

      it('acquires user location, dispatches to stores, notifies user', done => {
        const [app, _, {notify}] = setup();
        const publish = sinon.spy(app.locPubActions, 'publish');

        app.locPubActions.ping(geoStub, .0001, .0001).should.be.fulfilled
          .then(() => {

            getStub.should.have.been.calledOnce;
            publish.should.have.been.calledWith(s17Nav, .0001);

            publish.restore();
          }).should.notify(done);
      });
    });

    describe('when location services disabled', () => {

      const getStub = sinon.stub().returns(Promise.reject('Phone not providing location.'));
      const geoStub = { get: getStub };

      it('notifies user', done => {

        const [app, _, {notify}] = setup();
        const publish = sinon.spy(app.locPubActions, 'publish');

        app.locPubActions.ping(geoStub, .0001, .0001).should.be.rejected
          .then(() => {

            getStub.should.have.been.calledOnce;
            notify.should.have.been.calledWith('Phone not providing location.');
            publish.should.have.not.been.called;

            publish.restore();
          }).should.notify(done);
      });
    });
  });

  describe('#poll', () => {

    it('turns on location polling, dispatches, notifies user', (done) => {

      const [app, _, {notify}] = setup();
      const schedule = sinon.stub(sc, 'schedule').returns(1);
      const ping = app.locPubActions.ping;
      const bind = sinon.stub(ping, 'bind', _ => ping);

      app.locPubActions.poll(1, .0001).should.be.fulfilled
        .then(() => {

          schedule.should.have.been.calledWith(ping, 1000);
          bind.should.have.been.calledWith(app.locPubActions);
          shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_ON);
          shouldHaveDispatchedWith(app, LocPubConstants.POLLING_ON, 1);
          notify.should.have.been.calledWith('Location sharing on.', .0001);

          schedule.restore();
          bind.restore();
        }).should.notify(done);
      schedule.restore();
      bind.restore();// in case test fails!
    });
  });

  describe('#stopPolling', () => {

    it('turns off user location polling, dispathces to stores, notifies user', (done) => {

      const [app, _, {notify}] = setup();
      const cancel = sinon.spy(sc, 'cancel');

      app.locPubActions.stopPolling(1, .0001).should.be.fulfilled.then(() => {

        cancel.should.have.been.calledOnce;
        shouldHaveDispatched(app, GoButtonConstants.GO_BUTTON_OFF);
        shouldHaveDispatched(app, LocPubConstants.POLLING_OFF);
        notify.should.have.been.calledWith('Location sharing off.', .0001);

        cancel.restore();
      }).should.notify(done);
    });
  });
});
