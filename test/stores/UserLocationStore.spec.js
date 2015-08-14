const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../src/application');
const { Map } = require('immutable');
const { dispatch, hasDispatched, createApplication } = require('marty/test-utils');
const { shouldHaveObjectEquality, shouldHaveNotifiedWith } = require('../support/matchers');

const UserLocationConstants = require('../../src/constants/UserLocationConstants');
const UserLocation = require('../../src/models/UserLocation');
const Location = require('../../src/models/Location');
const { s17, s17_, s17Nav, s17_Nav } = require('../support/sampleLocations');

describe('UserLocationStore', () => {

  const emptyState = Map({
    loc: UserLocation(),
    polling: false,
    pollId: -1,
    lastPing: -1
  });
  const ping1State = Map({
    loc: UserLocation(s17),
    polling: false,
    pollId: -1,
    lastPing: s17.time
  });
  const ping2State = Map({
    loc: UserLocation(s17_),
    polling: false,
    pollId: -1,
    lastPing: s17_.time
  });
  const pollState =  Map({
    loc: UserLocation(),
    polling: true,
    pollId: 1,
    lastPing: -1
  });

  const setup = (state) => {
    const app = createApplication(Application, { include: ['userLocationStore'] });
    app.userLocationStore.state = state;

    const listener = sinon.spy();
    app.userLocationStore.addChangeListener(listener);

    return [app, listener];
  };

  const restore = (fn) => fn.restore();

  describe('handlers', () => {

    describe('#setLoc', () => {

      it('sets location and lastPing', () => {
        const [app, _] = setup(emptyState);
        app.userLocationStore.state.get('loc').equals(UserLocation()).should.equal(true);

        app.userLocationStore.setLoc(Location(s17));

        app.userLocationStore.state.get('lastPing').should.equal(s17.time);
        shouldHaveObjectEquality(
          app.userLocationStore.state.get('loc'),
          UserLocation(s17));
      });

      it('handles USER_LOCATION_ACQUIRED', () => {
        const [app, _] = setup(emptyState);
        app.userLocationStore.state.get('loc').equals(UserLocation()).should.equal(true);
        sinon.spy(app.userLocationStore, 'setLoc');

        dispatch(app, UserLocationConstants.USER_LOCATION_ACQUIRED, Location(s17));

        app.userLocationStore.setLoc.should.have.been.calledWith(Location(s17));
        app.userLocationStore.setLoc.restore();
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(emptyState);
        dispatch(app, UserLocationConstants.USER_LOCATION_ACQUIRED, Location(s17));

        listener.should.have.been.calledOnce;
        shouldHaveNotifiedWith(listener, ping1State);
      });
    });

    describe('#pollingOn', () => {

      it('turns polling on and stores pollId', () => {
        const [app, _] = setup(emptyState);
        app.userLocationStore.state.get('polling').should.equal(false);
        app.userLocationStore.state.get('pollId').should.equal(-1);

        app.userLocationStore.pollingOn(1);

        app.userLocationStore.state.get('polling').should.equal(true);
        app.userLocationStore.state.get('pollId').should.equal(1);
      });

      it('handles POLLING_ON', () => {
        const [app, _] = setup(emptyState);
        app.userLocationStore.state.get('polling').should.equal(false);
        app.userLocationStore.state.get('pollId').should.equal(-1);
        sinon.spy(app.userLocationStore, 'pollingOn');

        dispatch(app, UserLocationConstants.POLLING_ON, 1);

        app.userLocationStore.pollingOn.should.have.been.calledWith(1);
        app.userLocationStore.pollingOn.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(emptyState);
        app.userLocationStore.pollingOn(1);

        listener.should.have.been.calledOnce;
        shouldHaveNotifiedWith(listener, pollState);
      });
    });

    describe('#pollingOff', () => {

      it('turns polling off and sets pollId to -1', () => {
        const [app, _] = setup(pollState);
        app.userLocationStore.state.get('polling').should.equal(true);
        app.userLocationStore.state.get('pollId').should.equal(1);

        app.userLocationStore.pollingOff();

        app.userLocationStore.state.get('polling').should.equal(false);
        app.userLocationStore.state.get('pollId').should.equal(-1);
      });

      it('handles POLLING_OFF', () => {
        const [app, _] = setup(pollState);
        app.userLocationStore.state.get('polling').should.equal(true);
        app.userLocationStore.state.get('pollId').should.equal(1);
        sinon.spy(app.userLocationStore, 'pollingOff');

        dispatch(app, UserLocationConstants.POLLING_OFF);

        app.userLocationStore.pollingOff.should.have.been.calledOnce;
        app.userLocationStore.pollingOff.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(pollState);
        app.userLocationStore.pollingOff();

        listener.should.have.been.calledOnce;
        shouldHaveNotifiedWith(listener, emptyState);

      });
    });
  });

  describe('accessors', () => {

    describe('#getLoc', () => {

      it('returns current user location', () => {
        const [app, _] = setup(ping1State);
        app.userLocationStore.getLoc().equals(UserLocation(s17)).should.equal(true);

        app.userLocationStore.setLoc(Location(s17_));
        app.userLocationStore.getLoc().equals(UserLocation(s17_)).should.equal(true);
      });
    });

    describe('#isPolling', () => {

      it('returns polling state (Boolean)', () => {
        const [app, _] = setup(emptyState);
        app.userLocationStore.isPolling().should.equal(false);

        app.userLocationStore.pollingOn(1);
        app.userLocationStore.isPolling().should.equal(true);
      });
    });

    describe('#getPollId', () => {

      it('returns ID of current Navigator Watch process', () => {
        const [app, _] = setup(emptyState);
        app.userLocationStore.getPollId().should.equal(-1);

        app.userLocationStore.pollingOn(1);
        app.userLocationStore.getPollId().should.equal(1);
      });
    });

    describe('#getLastPing', () => {

      it('returns time of last location update', () => {
        const [app, _] = setup(ping1State);
        app.userLocationStore.getLastPing().should.equal(s17.time);

        app.userLocationStore.setLoc(s17_);
        app.userLocationStore.getLastPing().should.equal(s17_.time);
      });
    });
  });
});
