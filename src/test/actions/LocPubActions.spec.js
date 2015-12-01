import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

import Application from '../../app/application';
import { createApplication } from 'marty/test-utils';

const {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
  shouldHaveDispatchedWithImmutable,
  shouldHaveBeenCalledWithImmutable,
  shouldHaveObjectEquality
} = require('../support/matchers');

import LocPubConstants from '../../app/constants/LocPubConstants';
import LocSubConstants from '../../app/constants/LocSubConstants';
import NotificationConstants from '../../app/constants/NotificationConstants';
import GoButtonConstants from '../../app/constants/GoButtonConstants';
import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';

import geo from '../../app/modules/geo';
import sc from '../../app/modules/scheduler';
import { s17, s17Nav } from '../support/sampleLocations';
import { emptyState, ping1State, ping2State, pollState } from '../support/samplePingStates';
import { toJS } from 'immutable';
import { merge } from 'lodash';

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

    const spies = merge({}, locSubSpies, notifySpies);

    const app = createApplication(Application, {
      include: ['locPubActions'],
      stub: {
        locSubActions: locSubSpies,
        notificationActions: notifySpies
      }
    });

    return [app, spies];
  };

  describe('#publish', () => {

    it('dispatches USER_LOCATION_ACQUIRED and passes loc to Notification and LocSub actions', done => {
      const [app, {update, notify} ] = setup();
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
        const [app, {notify}] = setup();
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

        const [app, {notify}] = setup();
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

      const [app, {notify}] = setup();
      const schedule = sinon.stub(sc, 'schedule').returns(1);
      const ping = app.locPubActions.ping;
      const bind = sinon.stub(ping, 'bind', _ => ping);

      app.locPubActions.poll(1, .0001).should.be.fulfilled
        .then(() => {

          schedule.should.have.been.calledWith(ping, 1);
          bind.should.have.been.calledWith(app.locPubActions);
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

      const [app, {notify}] = setup();
      const cancel = sinon.spy(sc, 'cancel');

      app.locPubActions.stopPolling(1, .0001).should.be.fulfilled.then(() => {

        cancel.should.have.been.calledOnce;
        shouldHaveDispatched(app, LocPubConstants.POLLING_OFF);
        notify.should.have.been.calledWith('Location sharing off.', .0001);

        cancel.restore();
      }).should.notify(done);
    });
  });

  describe('#resetPolling', () => {

    it('turns location polling off then on with new frequency', done => {

      const [[app, {notify}], cancel, schedule] = [
        setup(),
        sinon.spy(sc, 'cancel'),
        sinon.stub(sc, 'schedule').returns(2)
      ];
      const ping = app.locPubActions.ping;
      const bind = sinon.stub(ping, 'bind', _ => ping);

      app.locPubActions.resetPolling(1, 15, .0001).should.be.fulfilled.then(() => {

        cancel.should.have.been.calledWith(1);
        bind.should.have.been.calledWith(app.locPubActions);
        schedule.should.have.been.calledWith(ping, 15);
        shouldHaveDispatchedWith(app, LocPubConstants.POLLING_RESET, 2);
        notify.should.have.been.calledWith('Location sharing restarted.', .0001);

        cancel.restore();
        schedule.restore();
      }).should.notify(done);
    });
  });
});
