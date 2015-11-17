import sinon from'sinon';
import chai from'chai';
import sinonChai from'sinon-chai';
import chaiAsPromised from'chai-as-promised';
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

import http from'superagent';
require('superagent-mock')(http, config);
import moment from 'moment';
import config from'../support/mocks/server/config';
import api from'../../app/modules/api';
import sc from '../../app/modules/scheduler';
import time from'../../app/modules/time';

import Application from'../../app/application';
import { createApplication, getDispatchedActionsWithType } from'marty/test-utils';
import {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
  shouldHaveDispatchedNthTimeWith,
  shouldHaveDispatchedWithImmutable,
  shouldHaveBeenCalledWithImmutable
} from'../support/matchers';

import LocSubConstants from'../../app/constants/LocSubConstants';
import Location from'../../app/models/Location';
import UserLocation from'../../app/models/UserLocation';
import UserLocationRefresh from'../../app/models/UserLocationRefresh';
import User from'../../app/models/User';
import USER_ID from'../../app/constants/Keys';
import { FORGET_INTERVAL } from '../../app/constants/Intervals';

import { s17, s17_, s17UL } from'../support/sampleLocations';
import { emptyState, ping1State, ping2State, pollState } from'../support/samplePingStates';
import stgs from '../../app/constants/Settings';
const { locTtl: { values: ttls } } = stgs;

import { merge } from 'lodash';

describe('LocSubActions', () => {

  const setup = (state = emptyState) => {

    const spies = {
      notify: { notify: sinon.spy() },
      locPub: { ping: sinon.spy() }
    };

    const app = createApplication(Application, {
      include: ['locSubActions', 'locPubStore'],
      stub: {
        notificationActions: spies.notify,
        locPubActions: spies.locPub
      }
    });
    app.locPubStore.state = state;
    return [app, merge({}, spies.notify, spies.locPub)];
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

  describe('#refresh', () => {

    it('dispatches refresh request then pings new location', done => {

      const [app, {ping}] = setup(ping2State);

      app.locSubActions.refresh().should.be.fulfilled.then(() => {

        shouldHaveDispatched(app, LocSubConstants.LOC_REFRESH_TRIGGERED);
        ping.should.have.been.calledOnce;

      }).should.notify(done);
    });
  });

  describe('#scheduleForget', () => {

    it("schedules forget every minute with a given TTL param", () => {

      const [app] = setup();
      const schedule = sinon.stub(sc, 'schedule');
      schedule.onCall(0).returns(0).onCall(1).returns(1);
      const forget = app.locSubActions.forget;
      const forgetPartials = [ttls[0], ttls[1]].map( ttl => () => forget(ttl));
      const bind = sinon.stub(forget, 'bind');
      bind.withArgs(app.locSubActions, ttls[0]).returns(forgetPartials[0]);
      bind.withArgs(app.locSubActions, ttls[1]).returns(forgetPartials[1]);

      app.locSubActions.scheduleForget(ttls[0]);
      bind.should.have.been.calledWith(app.locSubActions, ttls[0]);
      schedule.should.have.been.calledWith(forgetPartials[0], FORGET_INTERVAL);
      shouldHaveDispatchedNthTimeWith(
        app, 0, LocSubConstants.LOC_FORGET_SCHEDULED, 0);

      app.locSubActions.scheduleForget(ttls[1]);
      bind.should.have.been.calledWith(app.locSubActions, ttls[1]);
      schedule.should.have.been.calledWith(forgetPartials[1]);
      shouldHaveDispatchedNthTimeWith(
        app, 1, LocSubConstants.LOC_FORGET_SCHEDULED, 1);

      schedule.restore();
      bind.restore();
    });
  });

  describe('#rescheduleForget', () => {

    it('cancels current forget job and schedules a new one with new ttl', () => {
      const [app] = setup();
      const schedule = sinon.stub(sc, 'schedule');
      schedule.onCall(0).returns(0).onCall(1).returns(1);
      const cancel = sinon.spy(sc, 'cancel');
      const forget = app.locSubActions.forget;
      const forgetPartials = [ttls[0], ttls[1]].map( ttl => () => forget(ttl));
      const bind = sinon.stub(forget, 'bind');
      bind.withArgs(app.locSubActions, ttls[0]).returns(forgetPartials[0]);
      bind.withArgs(app.locSubActions, ttls[1]).returns(forgetPartials[1]);

      app.locSubActions.rescheduleForget(-1, ttls[0]);
      bind.should.have.been.calledWith(app.locSubActions, ttls[0]);
      cancel.should.have.been.calledWith(-1);
      schedule.should.have.been.calledWith(forgetPartials[0]);
      shouldHaveDispatchedNthTimeWith(
        app, 0, LocSubConstants.LOC_FORGET_RESCHEDULED, 0);

      app.locSubActions.rescheduleForget(0, ttls[1]);
      bind.should.have.been.calledWith(app.locSubActions, ttls[1]);
      cancel.should.have.been.calledWith(0);
      schedule.should.have.been.calledWith(forgetPartials[1]);
      shouldHaveDispatchedNthTimeWith(
        app, 1, LocSubConstants.LOC_FORGET_RESCHEDULED, 1);

      schedule.restore();
      cancel.restore();
      bind.restore();


    });
  });

  describe('#forget', () => {

    describe('when ttl is 30 min', () => {

      it('initiates deletion w/ specified ttl, notifies user', done => {
        const [app, {notify}] = setup(ping1State);

        app.locSubActions.forget(ttls[0], s17.time).should.be.fulfilled.then(() => {

          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATION_FORGET_TRIGGERED, ttls[0], s17.time);
          notify.should.have.been.calledWith(
            'Deleting location data older than Friday 11:30PM');

        }).should.notify(done);
      });
    });

    describe('when ttl is 1 hr', () => {

      it('initiates deletion w/ specified ttl, notifies user', done => {
        const [app, {notify}] = setup(ping1State);

        app.locSubActions.forget(ttls[1], s17.time).should.be.fulfilled.then(() => {

          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATION_FORGET_TRIGGERED, ttls[1], s17.time);
          notify.should.have.been.calledWith(
            'Deleting location data older than Friday 11:00PM');

        }).should.notify(done);
      });
    });

    describe('when ttl is 2 hr', () => {

      it('initiates deletion w/ specified ttl, notifies user', done => {
        const [app, {notify}] = setup(ping1State);

        app.locSubActions.forget(ttls[2], s17.time).should.be.fulfilled.then(() => {

          shouldHaveDispatchedWith(
            app, LocSubConstants.LOCATION_FORGET_TRIGGERED, ttls[2], s17.time);
          notify.should.have.been.calledWith(
            'Deleting location data older than Friday 10:00PM');

        }).should.notify(done);
      });
    });


  });
});
