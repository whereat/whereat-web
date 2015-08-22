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
const User = require('../../src/models/User');
const USER_ID = require('../../src/constants/Keys');

const time = require('../../src/modules/time');
const { s17, s17_, s17UL } = require('../support/sampleLocations');
const { emptyState, ping1State, ping2State, pollState } = require('../support/samplePingStates');

describe('LocSubActions', () => {

  const setup = (state) => {

    const notifySpies = {
      notify: sinon.spy()
    };

    const app = createApplication(Application, {
      include: ['locSubActions', 'locPubStore'],
      stub: { notificationActions: notifySpies  }
    });
    app.locPubStore.state = state;
    return [app, notifySpies];
  };


  describe('#update', () =>{

    describe('on first ping', () => {

      it('POSTS lastPing/location, sets new `lastPing`, dispatches new locations', done => {
        const [app] = setup(ping1State);
        const update = sinon.spy(api, 'update');

        app.locSubActions.update(UserLocation(s17), () => s17.time).should.be.fulfilled
          .then(() =>{

            shouldHaveDispatchedWith(
              app, LocSubConstants.UPDATE_STARTING, s17.time);

            shouldHaveBeenCalledWithImmutable(
              update,
              UserLocationRefresh({
                lastPing: -1,
                location: UserLocation(s17)}));

            shouldHaveDispatchedWith(
              app,
              LocSubConstants.LOCATIONS_RECEIVED, [s17UL, UserLocation(s17).toJS()]);

            update.restore();
          }).should.notify(done);
      });
    });

    describe('on subsequent pings', () => {

      it('POSTS lastPing/location, sets new `lastPing`, dispatches new locations', done => {

        const [app] = setup(ping2State);
        const update = sinon.spy(api, 'update');

        app.locSubActions.update(UserLocation(s17_), () => s17_.time).should.be.fulfilled
          .then(() =>{

            shouldHaveDispatchedWith(
              app, LocSubConstants.UPDATE_STARTING, s17_.time);

            shouldHaveBeenCalledWithImmutable(
              update,
              UserLocationRefresh({
                lastPing: s17.time,
                location: UserLocation(s17_)}));

            shouldHaveDispatchedWith(
              app,
              LocSubConstants.LOCATIONS_RECEIVED, [s17UL, UserLocation(s17_).toJS()]);

            update.restore();
          }).should.notify(done);
      });
    });
  });

  describe('#remove', () => {

    it.only('sends remove request to server, dispatches results, notfies user', done => {

      const [app, {notify}] = setup(ping2State);
      const remove = sinon.spy(api, 'remove');

      app.locSubActions.remove(User(USER_ID), () => s17_.time).should.be.fulfilled
        .then(() => {

          shouldHaveDispatchedWith( app, LocSubConstants.REMOVE_STARTING, s17_.time );
          shouldHaveBeenCalledWithImmutable( remove, User(USER_ID) );
          shouldHaveDispatched( app, LocSubConstants.USER_REMOVED );
          notify.should.have.been.calledWith('User data removed from server.');

          remove.restore();
        }).should.notify(done);
    });
  });
});
