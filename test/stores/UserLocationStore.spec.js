const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../src/application');
const { Map } = require('immutable');
const { dispatch, hasDispatched, createApplication } = require('marty/test-utils');
const { shouldHaveObjectEquality, shouldHaveBeenCalledWithImmutable } = require('../support/matchers');

const LocPubConstants = require('../../src/constants/LocPubConstants');
const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');
const UserLocationRefresh = require('../../src/models/UserLocationRefresh');
const { s17, s17_, s17Nav, s17_Nav } = require('../support/sampleLocations');

describe('LocPubStore', () => {

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

    const actions = {
      init: sinon.spy(),
      refresh: sinon.spy()
    };

    const app = createApplication(Application, {
      include: ['locPubStore'],
      stub: { locationSubscriptionActions: actions }
    });
    app.locPubStore.state = state;

    const listener = sinon.spy();
    app.locPubStore.addChangeListener(listener);

    return [app, listener, actions];
  };

  const restore = (fn) => fn.restore();

  describe('handlers', () => {

    describe('#setLoc', () => {

      it('sets location and lastPing', () => {
        const [app] = setup(emptyState);
        app.locPubStore.state.get('loc').equals(UserLocation()).should.equal(true);

        app.locPubStore.setLoc(Location(s17));

        app.locPubStore.state.get('lastPing').should.equal(s17.time);
        shouldHaveObjectEquality(
          app.locPubStore.state.get('loc'),
          UserLocation(s17));
      });

      it('handles USER_LOCATION_ACQUIRED', () => {
        const [app] = setup(emptyState);
        app.locPubStore.state.get('loc').equals(UserLocation()).should.equal(true);
        sinon.spy(app.locPubStore, 'setLoc');

        dispatch(app, LocPubConstants.USER_LOCATION_ACQUIRED, Location(s17));

        app.locPubStore.setLoc.should.have.been.calledWith(Location(s17));
        app.locPubStore.setLoc.restore();
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(emptyState);
        dispatch(app, LocPubConstants.USER_LOCATION_ACQUIRED, Location(s17));

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, ping1State);
      });

      describe('when first ping', () => {

        it('initializes location subscription', () => {
          const [app, _, {init, refresh}] = setup(emptyState);
          app.locPubStore.setLoc(s17);

          shouldHaveBeenCalledWithImmutable(init, UserLocation(s17));
          refresh.should.not.have.been.called;
        });
      });

      describe('when not first ping', () => {

        it('refreshes the location subscription', () => {
          const [app, _, {init, refresh}] = setup(ping1State);
          app.locPubStore.setLoc(s17_);

          shouldHaveBeenCalledWithImmutable(
            refresh,
            UserLocationRefresh({
              lastPing: s17.time,
              location: UserLocation(s17_)
            }));
          init.should.not.have.been.called;
        });
      });
    });

    describe('#pollingOn', () => {

      it('turns polling on and stores pollId', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.state.get('polling').should.equal(false);
        app.locPubStore.state.get('pollId').should.equal(-1);

        app.locPubStore.pollingOn(1);

        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);
      });

      it('handles POLLING_ON', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.state.get('polling').should.equal(false);
        app.locPubStore.state.get('pollId').should.equal(-1);
        sinon.spy(app.locPubStore, 'pollingOn');

        dispatch(app, LocPubConstants.POLLING_ON, 1);

        app.locPubStore.pollingOn.should.have.been.calledWith(1);
        app.locPubStore.pollingOn.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(emptyState);
        app.locPubStore.pollingOn(1);

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, pollState);
      });
    });

    describe('#pollingOff', () => {

      it('turns polling off and sets pollId to -1', () => {
        const [app, _] = setup(pollState);
        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);

        app.locPubStore.pollingOff();

        app.locPubStore.state.get('polling').should.equal(false);
        app.locPubStore.state.get('pollId').should.equal(-1);
      });

      it('handles POLLING_OFF', () => {
        const [app, _] = setup(pollState);
        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);
        sinon.spy(app.locPubStore, 'pollingOff');

        dispatch(app, LocPubConstants.POLLING_OFF);

        app.locPubStore.pollingOff.should.have.been.calledOnce;
        app.locPubStore.pollingOff.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(pollState);
        app.locPubStore.pollingOff();

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, emptyState);
      });
    });
  });

  describe('accessors', () => {

    describe('#getLoc', () => {

      it('returns current user location', () => {
        const [app, _] = setup(ping1State);
        app.locPubStore.getLoc().equals(UserLocation(s17)).should.equal(true);

        app.locPubStore.setLoc(Location(s17_));
        app.locPubStore.getLoc().equals(UserLocation(s17_)).should.equal(true);
      });
    });

    describe('#isPolling', () => {

      it('returns polling state (Boolean)', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.isPolling().should.equal(false);

        app.locPubStore.pollingOn(1);
        app.locPubStore.isPolling().should.equal(true);
      });
    });

    describe('#getPollId', () => {

      it('returns ID of current Navigator Watch process', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.getPollId().should.equal(-1);

        app.locPubStore.pollingOn(1);
        app.locPubStore.getPollId().should.equal(1);
      });
    });

    describe('#getLastPing', () => {

      it('returns time of last location update', () => {
        const [app, _] = setup(ping1State);
        app.locPubStore.getLastPing().should.equal(s17.time);

        app.locPubStore.setLoc(s17_);
        app.locPubStore.getLastPing().should.equal(s17_.time);
      });
    });
  });
});
