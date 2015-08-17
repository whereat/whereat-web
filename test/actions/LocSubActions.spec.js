const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const http = require('superagent');
const config = require('../support/mocks/server/config');
require('superagent-mock')(http, config);
const api = require('../../src/modules/api');

const Application = require('../../src/application');
const { createApplication, getDispatchedActionsWithType } = require('marty/test-utils');
const {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
  shouldHaveDispatchedWithImmutable,
  shouldHaveBeenCalledWithImmutable
} = require('../support/matchers');

const LocSubConstants = require('../../src/constants/LocSubConstants');
const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');
const UserLocationRefresh = require('../../src/models/UserLocationRefresh');

const time = require('../../src/modules/time');
const { s17, s17_, s17UL } = require('../support/sampleLocations');
const { emptyState, ping1State, ping2State, pollState } = require('../support/samplePingStates');

describe.only('LocSubActions', () => {

  const setup = (state) => {
    const app = createApplication(Application, {
      include: ['locSubActions', 'locPubStore']
    });
    app.locPubStore.state = state;
    return app;
  };


  describe('#update', () =>{

    describe('on first ping', () => {

      it('delegates to #init', () => {
        const app = setup(ping1State);
        const init = sinon.spy(app.locSubActions, 'init');
        app.locSubActions.update(UserLocation(s17));

        shouldHaveBeenCalledWithImmutable(init, UserLocation(s17));

        init.restore();
      });
    });

    describe('on subsequent pings', () => {

      it('delegates to #refresh', () => {

        const app = setup(ping2State);
        const refresh = sinon.spy(app.locSubActions, 'refresh');
        app.locSubActions.update(UserLocation(s17_));

        shouldHaveBeenCalledWithImmutable(
          refresh,
          UserLocationRefresh({
            lastPing: s17.time,
            location: UserLocation(s17_)
          }));

        refresh.restore();
      });
    });
  });

  describe('#init', () => {

    it('POSTS location to server and dispatches returned locations', done => {
      const app = setup(emptyState);
      const init = sinon.spy(api, 'init');

      app.locSubActions.init(UserLocation(s17), () => s17.time).should.be.fulfilled
        .then(() => {

          shouldHaveDispatchedWith(
            app, LocSubConstants.INIT_STARTING, s17.time);
          shouldHaveBeenCalledWithImmutable(
            init, UserLocation(s17));
          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATIONS_RECEIVED, [UserLocation(s17).toJS()]);

          init.restore();
        }).should.notify(done);
    });
  });

  describe('#refresh', () => {

    it('POSTS location and lastPing to server and dispatches returned locations', done => {
      const app = setup(emptyState);
      const req = UserLocationRefresh({
        lastPing: s17.time,
        location: UserLocation(s17_)
      });
      const refresh = sinon.spy(api, 'refresh');

      app.locSubActions.refresh(req, () => s17_.time).should.be.fulfilled
        .then(() => {
          shouldHaveDispatchedWith(
            app, LocSubConstants.REFRESH_STARTING, s17_.time);
          shouldHaveBeenCalledWithImmutable(
            refresh, UserLocationRefresh(req));
          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATIONS_RECEIVED, [s17UL, UserLocation(s17_).toJS()]);

          refresh.restore();
        }).should.notify(done);
    });
  });
});
