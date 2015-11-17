import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
const should = chai.should();
chai.use(sinonChai);

import moment from 'moment';

import Marty from 'marty';
import Application from '../../app/application';
import { dispatch, createApplication } from 'marty/test-utils';
import {
  shouldHaveBeenCalledWithImmutable,
  shouldHaveObjectEquality
} from '../support/matchers';

import LocSubConstants from '../../app/constants/LocSubConstants';
import LocPubConstants from '../../app/constants/LocPubConstants';
import SettingsConstants from '../../app/constants/SettingsConstants';
import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';
import { Map, Seq } from 'immutable';
import { s17, s17UL, s17_UL, nyse3Seq, nyse3ULSeq } from '../support/sampleLocations';
import {
  clearState, nyse3State, nyse3ModTimeState, nyse3ModTtlState, nyse3ModForgetJobState
} from '../support/sampleLocSubStates.js';
import stgs from '../../app/constants/Settings';
const { locTtl: { values: ttls } } = stgs;

describe('LocSubStore', () => {

  const setup = (state = clearState) => {
    const app = createApplication(Application, { include: ['locSubStore'] });
    app.locSubStore.replaceState(state);

    const listener = sinon.spy();
    app.locSubStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#save', () => {

      it('handles LOCATION_RECEIVED', () => {
        const [app, _] = setup();
        const save = sinon.spy(app.locSubStore, 'save');
        dispatch(app, LocSubConstants.LOCATION_RECEIVED, UserLocation(s17UL));

        shouldHaveBeenCalledWithImmutable( save, UserLocation(s17UL) );
        save.restore();
      });

      it('adds a location to the store', () => {
        const [app, _] = setup();
        app.locSubStore.save(UserLocation(s17UL));

        shouldHaveObjectEquality(
          app.locSubStore.state.getIn(['locs', s17UL.id]),
          UserLocation(s17UL));
      });

      it('updates a location already in the store', () => {
        const [app, _] = setup();
        app.locSubStore.save(UserLocation(s17UL));
        app.locSubStore.save(UserLocation(s17_UL));

        app.locSubStore.state.get('locs').valueSeq().size.should.equal(1);
        shouldHaveObjectEquality(
          app.locSubStore.state.getIn(['locs', s17UL.id]),
          UserLocation(s17_UL));
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup();
        app.locSubStore.save(UserLocation(s17UL));

        listener.should.have.been.calledOnce;
      });
    });

    describe('#saveMany', () => {

      it('responds to LOCATIONS_RECEIVED', () => {
        const [app] = setup();
        const saveMany = sinon.spy(app.locSubStore, 'saveMany');
        dispatch(app, LocSubConstants.LOCATIONS_RECEIVED, nyse3ULSeq);

        shouldHaveBeenCalledWithImmutable(saveMany, nyse3ULSeq);
        saveMany.restore();
      });

      it('adds many external user locations to the store', () => {
        const [app] = setup();
        nyse3Seq.size.should.equal(3);
        app.locSubStore.saveMany(nyse3ULSeq);

        app.locSubStore.state.get('locs').valueSeq().size.should.equal(3);
        shouldHaveObjectEquality(app.locSubStore.state, nyse3State);
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup();
        const ls = nyse3ULSeq;
        app.locSubStore.saveMany(ls);

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, nyse3State);
      });
    });

    describe('#clear', () => {

      it('handles USER_REMOVED', () => {
        const [app] = setup(nyse3State);
        const clear = sinon.spy(app.locSubStore, 'clear');

        dispatch(app, LocSubConstants.LOC_REFRESH_TRIGGERED);

        clear.should.have.been.calledOnce;
        clear.restore();
      });

      it('clears all locations from the store', () => {

        const [app] = setup(nyse3State);
        app.locSubStore.getLocs().size.should.equal(3);

        app.locSubStore.clear();
        app.locSubStore.getLocs().size.should.equal(0);
        shouldHaveObjectEquality( app.locSubStore.state.get('locs'), Map() );
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(nyse3State);
        app.locSubStore.clear();

        shouldHaveBeenCalledWithImmutable(listener, clearState);
      });
    });


    describe('#recordForgetJob', () =>{


      it('handles LOC_FORGET_SCHEDULED and LOC_FORGET_RESCHEDULED', () => {

        const [app] = setup(nyse3State);
        const recordForgetJob = sinon.spy(app.locSubStore, 'recordForgetJob');

        dispatch(app, LocSubConstants.LOC_FORGET_SCHEDULED, 1);
        recordForgetJob.should.have.been.calledWith(1);

        dispatch(app, LocSubConstants.LOC_FORGET_RESCHEDULED, 2);
        recordForgetJob.should.have.been.calledWith(2);

        recordForgetJob.restore();
      });

      it('sets the value of the `forgetJob` field', () => {

        const [app] = setup(nyse3State);
        app.locSubStore.state.get('forgetJob').should.equal(-1);

        app.locSubStore.recordForgetJob(1);

        app.locSubStore.state.get('forgetJob').should.equal(1);
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(nyse3State);
        app.locSubStore.recordForgetJob(1);

        shouldHaveBeenCalledWithImmutable(listener, nyse3ModForgetJobState);
      });
    });

    describe('#forget', () =>{

      const hourLater = s17.time + (60 * 60 * 1000);

      it('handles LOCATION_FORGET_TRIGGERED', () => {

        const [app] = setup(nyse3State);
        const forget = sinon.spy(app.locSubStore, 'forget');

        dispatch(app, LocSubConstants.LOCATION_FORGET_TRIGGERED, ttls[1], s17.time);

        forget.should.have.been.calledWith(ttls[1], s17.time);
        forget.restore();
      });

      it('clears all locations from store older than an hour ago', () => {

        const [app] = setup(nyse3State);
        app.locSubStore.state.get('locs').valueSeq().size.should.equal(3);
        shouldHaveObjectEquality(app.locSubStore.state.get('locs'), nyse3State.get('locs'));

        app.locSubStore.forget(ttls[1], hourLater);

        app.locSubStore.state.get('locs').valueSeq().size.should.equal(0);
      });

      it("doesn't clear locations less than an hour old", () => {

        const [app] = setup(nyse3ModTimeState);
        app.locSubStore.state.get('locs').valueSeq().size.should.equal(3);

        app.locSubStore.forget(ttls[0], hourLater);

        app.locSubStore.state.get('locs').valueSeq().size.should.equal(1);
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(nyse3State);
        app.locSubStore.forget(ttls[0], hourLater);

        shouldHaveBeenCalledWithImmutable(listener, clearState);
      });
    });
  });

  describe('accessors', () => {

    describe('#getAll', () => {

      it('returns all locations in store', ()=> {
        const [app] = setup();
        app.locSubStore.saveMany(nyse3ULSeq);

        shouldHaveObjectEquality(
          app.locSubStore.getLocs(),
          nyse3ULSeq);
      });
    });

    describe('#getForgetJob', () => {

      it('returns id of currently running forget job', () => {
        const [app] = setup();
        app.locSubStore.getForgetJob().should.equal(-1);

        app.locSubStore.recordForgetJob(1);
        app.locSubStore.getForgetJob().should.equal(1);
      });
    });
  });
});
