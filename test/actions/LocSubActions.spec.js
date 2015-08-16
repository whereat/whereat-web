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

const api = require('../../src/modules/api');
const { s17, s17_, s17UL } = require('../support/sampleLocations');

describe('LocSubActions', () => {

  const setup = () => {
    return createApplication(Application, {include: ['locSubActions'] });
  };

  describe('#init', () => {

    it('POSTS location to server and dispatches returned locations', done => {
      const app = setup();
      sinon.spy(app.locSubActions, 'init');

      app.locSubActions.init(UserLocation(s17)).should.be.fulfilled
        .then(() => {
          shouldHaveDispatched(app, LocSubConstants.INIT_STARTING);
          shouldHaveBeenCalledWithImmutable(
            app.locSubActions.init, UserLocation(s17));
          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATIONS_RECEIVED, [UserLocation(s17).toJS()]);
          app.locSubActions.init.restore();
        }).should.notify(done);
    });
  });

  describe('#refresh', () => {

    it('POSTS location and lastPing to server and dispatches returned locations', done => {
      const app = setup();
      const req = UserLocationRefresh({
        lastPing: s17.time,
        location: UserLocation(s17_)
      });
      sinon.spy(app.locSubActions, 'refresh');

      app.locSubActions.refresh(req).should.be.fulfilled
        .then(() => {
          shouldHaveDispatched(app, LocSubConstants.LOC_SUB_REFRESH_STARTING);
          shouldHaveBeenCalledWithImmutable(
            app.locSubActions.refresh, UserLocationRefresh(req));
          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATIONS_RECEIVED, [s17UL, UserLocation(s17_).toJS()]);
          app.locSubActions.refresh.restore();
        }).should.notify(done);
    });
  });
});
